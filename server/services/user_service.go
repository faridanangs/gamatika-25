package services

import (
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
	dbErrorHandler     *helpers.DatabaseErrorHandler
}

func NewUserService(db *gorm.DB, val *validator.Validate) *UserService {
	return &UserService{
		db:                 db,
		val:                val,
		cachedContributors: make([]models.TopContributorsResponse, 0),
		dbErrorHandler:     helpers.NewDatabaseErrorHandler(),
	}
}

// CreateUser - Create new user with validation
func (us *UserService) CreateUser(req models.CreateUserRequest) (*models.UserResponse, error) {

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to process password",
		}
	}

	encryptedPrivateKey, err := utils.EncryptPrivateKeyWithPassword(req.PrivateKey, req.Password)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to encrypt private key",
		}
	}

	req.Avatar = "https://res.cloudinary.com/detetmaw8/image/upload/v1758013653/forum-comments/xzfg7jskt08evwbdh0n5.png"

	user := models.User{
		ID:         uuid.NewString(),
		FullName:   req.FullName,
		Username:   req.Username,
		Avatar:     req.Avatar,
		Prodi:      req.Prodi,
		Nim:        req.Nim,
		Email:      req.Email,
		Password:   hashedPassword,
		PublicKey:  req.PublicKey,
		PrivateKey: encryptedPrivateKey,
	}

	if err := us.db.Create(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User creation")
	}

	return us.mapToUserResponse(user), nil
}

// UpdateUser - Update existing user with ownership check
func (us *UserService) UpdateUser(req models.UpdateUserRequest, tokenString string) (*models.UserResponse, error) {
	userID, err := us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	if req.ID != userID {
		return nil, &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only update your own account",
		}
	}

	var user models.User
	if err := us.db.Where("id = ?", req.ID).First(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User lookup")
	}

	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Password != "" {
		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to process password",
			}
		}
		user.Password = hashedPassword
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}

	if err := us.db.Save(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User update")
	}

	return us.mapToUserResponse(user), nil
}

// DeleteUser - Delete user with ownership check
func (us *UserService) DeleteUser(id string, tokenString string) error {
	userID, err := us.ValidateUserToken(tokenString)
	if err != nil {
		return err
	}

	if id != userID {
		return &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only delete your own account",
		}
	}

	tx := us.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Where("user_id = ?", id).Delete(&models.Post{}).Error; err != nil {
		tx.Rollback()
		return us.dbErrorHandler.HandleTransactionError(err, "Post deletion")
	}

	if err := tx.Where("id = ?", id).Delete(&models.User{}).Error; err != nil {
		tx.Rollback()
		return us.dbErrorHandler.HandleTransactionError(err, "User deletion")
	}

	if err := tx.Commit().Error; err != nil {
		return us.dbErrorHandler.HandleTransactionError(err, "Transaction commit")
	}

	return nil
}

// GetUserByID - Get user by ID
func (us *UserService) GetUserByID(id string) (*models.UserResponse, error) {
	var user models.User
	if err := us.db.Preload("Posts").Preload("Posts.Comments").Preload("Posts.Author").Preload("Posts.Comments.Author").Where("id = ?", id).First(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User retrieval")
	}
	return us.mapToUserResponse(user), nil
}

// GetAllUsers - Get all users
func (us *UserService) GetAllUsers() ([]models.UserResponse, error) {
	var users []models.User
	if err := us.db.Preload("Posts").Preload("Posts.Comments").Preload("Posts.Author").Preload("Posts.Comments.Author").Find(&users).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "Users retrieval")
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
		return nil, "", us.dbErrorHandler.HandleError(err, "User authentication")
	}

	if !utils.CheckPassword(password, user.Password) {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid Password",
		}
	}

	token, err := middleware.GenerateJWT(user.ID, user.Username)
	if err != nil {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to generate authentication token",
		}
	}

	return us.mapToUserResponse(user), token, nil
}

// ValidateUserToken - Validate user token and check if user exists
func (us *UserService) ValidateUserToken(tokenString string) (string, error) {
	claims, err := middleware.ValidateJWT(tokenString)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	var user models.User
	if err := us.db.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		return "", us.dbErrorHandler.HandleError(err, "Token validation")
	}

	return user.ID, nil
}

// GetPrivateKeyWithPassword - Get user's private key
func (us *UserService) GetPrivateKeyWithPassword(userID string, req models.PrivKeyReq) (string, error) {
	var user models.User
	if err := us.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return "", us.dbErrorHandler.HandleError(err, "User lookup")
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid password",
		}
	}

	privateKey, err := utils.DecryptPrivateKeyWithPassword(user.PrivateKey, req.Password)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to decrypt private key",
		}
	}

	return privateKey, nil
}

// CalculateUserContribution - Calculate user contribution metrics
func (us *UserService) CalculateUserContribution(userID string) (*models.Contribution, error) {
	var contribution models.Contribution
	var user models.User

	if err := us.db.Preload("Posts").Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User contribution calculation")
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

	var comments []models.Comment
	if err := us.db.Where("user_id = ?", userID).Find(&comments).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "Comments retrieval")
	}

	for _, comment := range comments {
		if comment.CreatedAt.After(sevenDaysAgo) {
			commentsCount++
		}
	}

	totalScore := (postsCount * 2) + (commentsCount * 3) + (likesReceived * 2) + (sharesReceived * 2)

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

// GetTopContributors - Get top contributors
func (us *UserService) GetTopContributors() ([]models.TopContributorsResponse, error) {
	var users []models.User
	var topContributors []models.TopContributorsResponse

	if err := us.db.Preload("Posts").Find(&users).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "Top contributors retrieval")
	}

	var contributions []models.Contribution
	for _, user := range users {
		if user.ID == "" {
			continue
		}

		contrib, err := us.CalculateUserContribution(user.ID)
		if err != nil {
			continue
		}
		contributions = append(contributions, *contrib)
	}

	if len(contributions) == 0 {
		return topContributors, nil
	}

	sort.Slice(contributions, func(i, j int) bool {
		return contributions[i].TotalScore > contributions[j].TotalScore
	})

	for i := 0; i < 3 && i < len(contributions); i++ {
		contrib := contributions[i]
		var user models.User

		for _, u := range users {
			if u.ID == contrib.UserID {
				user = u
				break
			}
		}

		if user.ID == "" {
			continue
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

// StartTopContributorScheduler - Start background scheduler
func (us *UserService) StartTopContributorScheduler() {
	ticker := time.NewTicker(5 * time.Minute)

	go func() {
		us.updateCache()
	}()

	go func() {
		for range ticker.C {
			us.updateCache()
		}
	}()
}

// updateCache - Update cached top contributors
func (us *UserService) updateCache() {
	contributors, err := us.GetTopContributors()
	if err != nil {
		return
	}

	if len(contributors) == 0 {
		return
	}

	us.mu.Lock()
	us.cachedContributors = contributors
	us.mu.Unlock()
}

// GetCachedTopContributors - Get cached top contributors
func (us *UserService) GetCachedTopContributors() []models.TopContributorsResponse {
	us.mu.RLock()
	defer us.mu.RUnlock()
	return us.cachedContributors
}

// mapToUserResponse - Helper function to map User to UserResponse
func (us *UserService) mapToUserResponse(user models.User) *models.UserResponse {
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
