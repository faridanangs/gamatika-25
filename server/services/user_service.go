package services

import (
	"log"
	"sort"
	"sync"
	"time"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct {
	db                 *gorm.DB
	val                *validator.Validate
	mu                 sync.RWMutex
	cachedContributors []models.TopContributorsResponse
}

func NewUserService(db *gorm.DB, val *validator.Validate) *UserService {
	return &UserService{
		db:                 db,
		val:                val,
		cachedContributors: make([]models.TopContributorsResponse, 0),
	}
}

// CreateUser - Create new user with validation
func (us *UserService) CreateUser(req models.CreateUserRequest) (*models.UserResponse, error) {
	// Validate request
	if err := us.val.Struct(&req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Check if username or email already exists
	var existingUser models.User
	if err := us.db.Where("username = ? OR email = ? OR nim = ?", req.Username, req.Email, req.Nim).First(&existingUser).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to check existing user",
			}
		}
	} else {
		return nil, &helpers.AppError{
			Code:    fiber.StatusConflict,
			Message: "Username or Email or Nim already exists",
		}
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)

	encryptedPrivateKey, err := utils.EncryptPrivateKeyWithPassword(req.PrivateKey, req.Password)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to encrypt private key",
		}
	}

	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to hash password",
		}
	}

	// Set default values
	avatar := req.Avatar
	if avatar == "" {
		avatar = "https://default-avatar.com/default.png"
	}

	// Create user
	user := models.User{
		ID:         uuid.NewString(),
		FullName:   req.FullName,
		Username:   req.Username,
		Avatar:     avatar,
		Prodi:      req.Prodi,
		Nim:        req.Nim,
		Email:      req.Email,
		Password:   hashedPassword,
		PublicKey:  req.PublicKey,
		PrivateKey: encryptedPrivateKey,
	}

	// Insert user
	if err := us.db.Create(&user).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create user",
		}
	}

	// Prepare response
	return us.mapToUserResponse(user), nil
}

// UpdateUser - Update existing user with ownership check
func (us *UserService) UpdateUser(req models.UpdateUserRequest, tokenString string) (*models.UserResponse, error) {
	userID, err := us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Validate request
	if err := us.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Check if user is updating their own account
	if req.ID != userID {
		return nil, &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only update your own account",
		}
	}

	// Find user
	var user models.User
	if err := us.db.Where("id = ?", req.ID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find user",
		}
	}

	// Update fields if provided
	if req.Username != "" {
		// Check if username is already taken by another user
		var existingUser models.User
		if err := us.db.Where("username = ? AND id != ?", req.Username, user.ID).First(&existingUser).Error; err != nil {
			if err != gorm.ErrRecordNotFound {
				return nil, &helpers.AppError{
					Code:    fiber.StatusInternalServerError,
					Message: "Failed to check existing username",
				}
			}
		} else {
			return nil, &helpers.AppError{
				Code:    fiber.StatusConflict,
				Message: "Username already exists",
			}
		}
		user.Username = req.Username
	}

	if req.Email != "" {
		var existingUser models.User
		if err := us.db.Where("email = ? AND id != ?", req.Email, user.ID).First(&existingUser).Error; err != nil {
			if err != gorm.ErrRecordNotFound {
				return nil, &helpers.AppError{
					Code:    fiber.StatusInternalServerError,
					Message: "Failed to check existing email",
				}
			}
		} else {
			return nil, &helpers.AppError{
				Code:    fiber.StatusConflict,
				Message: "Email already exists",
			}
		}
		user.Email = req.Email
	}

	if req.Password != "" {
		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to hash password",
			}
		}
		user.Password = hashedPassword
	}

	if err := us.db.Save(&user).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update user",
		}
	}

	return us.mapToUserResponse(user), nil
}

// DeleteUser - Delete user with ownership check
func (us *UserService) DeleteUser(id string, tokenString string) error {
	userID, err := us.ValidateUserToken(tokenString)
	if err != nil {
		return err
	}

	// Check if user is deleting their own account
	if id != userID {
		return &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only delete your own account",
		}
	}

	// Start transaction
	tx := us.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Delete all posts associated with the user
	if err := tx.Where("user_id = ?", id).Delete(&models.Post{}).Error; err != nil {
		tx.Rollback()
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to delete user's posts",
		}
	}

	// Delete the user
	if err := tx.Where("id = ?", id).Delete(&models.User{}).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
			}
		}
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to delete user",
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to commit transaction",
		}
	}

	return nil
}

// GetUserByID - Get user by ID with optimized field selection
func (us *UserService) GetUserByID(id string) (*models.UserResponse, error) {
	var user models.User
	if err := us.db.Preload("Posts").Preload("Posts.Comments").Preload("Posts.Author").Preload("Posts.Comments.Author").Where("id = ?", id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find user",
		}
	}
	return us.mapToUserResponse(user), nil
}

// GetAllUsers - Get all users
func (us *UserService) GetAllUsers() ([]models.UserResponse, error) {
	var users []models.User
	if err := us.db.Preload("Posts").Preload("Posts.Comments").Preload("Posts.Author").Preload("Posts.Comments.Author").Find(&users).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get users",
		}
	}
	responses := make([]models.UserResponse, len(users))
	for i, user := range users {
		responses[i] = *us.mapToUserResponse(user)
	}
	return responses, nil
}

// LoginUser - User authentication with JWT token
func (us *UserService) LoginUser(email, password string) (*models.UserResponse, string, error) {
	var user models.User
	if err := us.db.Where("username = ? OR email = ?", email, email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, "", &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Invalid credentials",
			}
		}
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to authenticate user",
		}
	}

	// Check password
	if !utils.CheckPassword(password, user.Password) {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid credentials",
		}
	}

	// Generate JWT token
	token, err := middleware.GenerateJWT(user.ID, user.Username)
	if err != nil {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to generate token",
		}
	}

	return us.mapToUserResponse(user), token, nil
}

// ValidateUserToken - Validate user token and check if user exists
func (us *UserService) ValidateUserToken(tokenString string) (string, error) {
	// Validate token
	claims, err := middleware.ValidateJWT(tokenString)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	// Check if user exists
	var user models.User
	if err := us.db.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "User not found",
			}
		}
		return "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find user",
		}
	}

	return user.ID, nil
}

func (us *UserService) GetPrivateKeyWithPassword(userID string, req models.PrivKeyReq) (string, error) {
	// Validasi password
	if err := us.val.Struct(req); err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	var user models.User
	if err := us.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
			}
		}
		return "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find user",
		}
	}

	// Verifikasi password
	if !utils.CheckPassword(req.Password, user.Password) {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid password",
		}
	}

	// Dekripsi private key
	privateKey, err := utils.DecryptPrivateKeyWithPassword(user.PrivateKey, req.Password)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to decrypt private key",
		}
	}

	return privateKey, nil
}

// Helper function to map User to UserResponse
func (us *UserService) mapToUserResponse(user models.User) *models.UserResponse {
	// Map posts to PostResponse with optimized field selection
	postResponses := make([]models.PostResponse, len(user.Posts))
	for i, post := range user.Posts {
		postResponses[i] = *helpers.MapToPostResponse(post)
	}

	return &models.UserResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		Username:  user.Username,
		Avatar:    user.Avatar,
		Prodi:     user.Prodi,
		Nim:       user.Nim,
		Email:     user.Email,
		PublicKey: user.PublicKey,
		CreatedAt: user.CreatedAt,
		Posts:     postResponses,
	}
}

func (us *UserService) CalculateUserContribution(userID string) (*models.Contribution, error) {
	var contribution models.Contribution
	var user models.User

	if err := us.db.Preload("Posts").Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusNotFound,
			Message: "User not found",
		}
	}

	sevenDaysAgo := time.Now().AddDate(0, 0, -7)

	var postsCount, commentsCount, likesReceived, sharesReceived uint64

	for _, post := range user.Posts {
		if post.CreatedAt.After(sevenDaysAgo) {
			postsCount++
			likesReceived += post.LikeCount
			sharesReceived += post.ShareCount
		}
	}

	comments := []models.Comment{}
	if err := us.db.Where("user_id = ?", userID).Find(&comments).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusNotFound,
			Message: "Comments not found",
		}
	}

	for _, comment := range comments {
		if comment.CreatedAt.After(sevenDaysAgo) {
			commentsCount++
		}
	}

	totalScore := (postsCount * 3) + (commentsCount * 1) + (likesReceived * 2) + (sharesReceived * 1)

	contribution = models.Contribution{
		UserID:         user.ID,
		Username:       user.Username,
		TotalScore:     totalScore,
		PostsCount:     postsCount,
		CommentsCount:  commentsCount,
		LikesReceived:  likesReceived,
		SharesReceived: sharesReceived,
		LastUpdated:    time.Now(),
	}

	return &contribution, nil
}

func (us *UserService) GetTopContributors() ([]models.TopContributorsResponse, error) {
	var users []models.User
	var topContributors []models.TopContributorsResponse

	if err := us.db.Preload("Posts").Find(&users).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get users",
		}
	}

	var contributions []models.Contribution
	for _, user := range users {
		contrib, err := us.CalculateUserContribution(user.ID)
		if err != nil {
			continue
		}
		contributions = append(contributions, *contrib)
	}

	sort.Slice(contributions, func(i, j int) bool {
		return contributions[i].TotalScore > contributions[j].TotalScore
	})

	// Ambil top 3
	for i := 0; i < 3 && i < len(contributions); i++ {
		contrib := contributions[i]
		var user models.User

		// Cari user yang sesuai
		for _, u := range users {
			if u.ID == contrib.UserID {
				user = u
				break
			}
		}

		topContributors = append(topContributors, models.TopContributorsResponse{
			Rank: uint64(i + 1),
			User: models.AuthorResponse{
				ID:       user.ID,
				Username: user.Username,
				Avatar:   user.Avatar,
			},
			Score: contrib.TotalScore,
			Breakdown: models.ContributionBreakdown{
				Posts:    contrib.PostsCount,
				Comments: contrib.CommentsCount,
				Likes:    contrib.LikesReceived,
				Shares:   contrib.SharesReceived,
			},
		})
	}

	return topContributors, nil
}

func (us *UserService) StartTopContributorScheduler() {
	ticker := time.NewTicker(5 * time.Minute)

	go func() {
		for range ticker.C {
			us.updateCache()
		}
	}()

	// Isi pertama kali saat service start
	us.updateCache()
}

func (us *UserService) updateCache() {
	contributors, err := us.GetTopContributors()
	if err != nil {
		log.Println("Failed to update top contributors:", err)
		return
	}

	us.mu.Lock()
	us.cachedContributors = contributors
	us.mu.Unlock()
}

func (us *UserService) GetCachedTopContributors() []models.TopContributorsResponse {
	us.mu.RLock()
	defer us.mu.RUnlock()
	return us.cachedContributors
}
