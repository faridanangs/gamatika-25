package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	db  *gorm.DB
	val *validator.Validate
}

func NewUserService(db *gorm.DB, val *validator.Validate) *UserService {
	return &UserService{
		db:  db,
		val: val,
	}
}

// Helper function to hash password
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Helper function to check password
func checkPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
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
	if err := us.db.Where("username = ? OR email = ?", req.Username, req.Email).First(&existingUser).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to check existing user",
			}
		}
	} else {
		return nil, &helpers.AppError{
			Code:    fiber.StatusConflict,
			Message: "Username or email already exists",
		}
	}

	// Hash password
	hashedPassword, err := hashPassword(req.Password)
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
		PrivateKey: req.PrivateKey,
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
		// Check if email is already taken by another user
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
		hashedPassword, err := hashPassword(req.Password)
		if err != nil {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to hash password",
			}
		}
		user.Password = hashedPassword
	}

	// Save changes
	if err := us.db.Save(&user).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update user",
		}
	}

	// Prepare response
	return us.mapToUserResponse(user), nil
}

// DeleteUser - Delete user with ownership check
func (us *UserService) DeleteUser(id string, tokenString string) error {
	// Validate user token
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

// GetUserByID - Get user by ID

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
func (us *UserService) LoginUser(username, password string) (*models.UserResponse, string, error) {
	var user models.User
	if err := us.db.Where("username = ? OR email = ?", username, username).First(&user).Error; err != nil {
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
	if !checkPassword(password, user.Password) {
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

// Helper function to map User to UserResponse
func (us *UserService) mapToUserResponse(user models.User) *models.UserResponse {
	// Map posts to PostResponse with optimized field selection
	postResponses := make([]models.PostResponse, len(user.Posts))
	for i, post := range user.Posts {
		postResponses[i] = us.mapToPostResponse(post)
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

// Helper function to map Post to PostResponse
func (us *UserService) mapToPostResponse(post models.Post) models.PostResponse {
	// Map comments to CommentResponse with optimized field selection
	commentResponses := make([]models.CommentResponse, len(post.Comments))
	for i, comment := range post.Comments {
		commentResponses[i] = us.mapToCommentResponse(comment)
	}

	return models.PostResponse{
		ID:           post.ID,
		Title:        post.Title,
		Content:      post.Content,
		Category:     post.Category,
		Image:        post.Image,
		LikeCount:    post.LikeCount,
		CommentCount: post.CommentCount,
		ShareCount:   post.ShareCount,
		Updated:      post.Updated,
		CreatedAt:    post.CreatedAt,
		UpdatedAt:    post.UpdatedAt,
		Author:       us.mapToAuthorResponse(post.Author),
		Comments:     commentResponses,
	}
}

// Helper function to map Comment to CommentResponse
func (us *UserService) mapToCommentResponse(comment models.Comment) models.CommentResponse {
	return models.CommentResponse{
		ID:        comment.ID,
		Author:    us.mapToAuthorResponse(comment.Author),
		Content:   comment.Content,
		Image:     comment.Image,
		Updated:   comment.Updated,
		CreatedAt: comment.CreatedAt,
		UpdatedAt: comment.UpdatedAt,
	}
}

// Helper function to map User to AuthorResponse
func (us *UserService) mapToAuthorResponse(user models.User) models.AuthorResponse {
	return models.AuthorResponse{
		ID:       user.ID,
		Username: user.Username,
		Avatar:   user.Avatar,
	}
}
