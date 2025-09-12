package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
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
	if err := us.val.Struct(req); err != nil {
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

// UpdateUser - Update existing user
func (us *UserService) UpdateUser(req models.UpdateUserRequest) (*models.UserResponse, error) {
	// Validate request
	if err := us.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Find user
	var user models.User
	if err := us.db.First(&user, req.ID).Error; err != nil {
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

// GetUserByID - Get user by ID
func (us *UserService) GetUserByID(id string) (*models.UserResponse, error) {
	var user models.User
	if err := us.db.Preload("Posts").First(&user, id).Error; err != nil {
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
	if err := us.db.Preload("Posts").Find(&users).Error; err != nil {
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

// DeleteUser - Delete user
func (us *UserService) DeleteUser(id string) error {
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
	if err := tx.Delete(&models.User{}, id).Error; err != nil {
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

// LoginUser - User authentication
func (us *UserService) LoginUser(username, password string) (*models.UserResponse, error) {
	var user models.User
	if err := us.db.Where("username = ? OR email = ?", username, username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Invalid credentials",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to authenticate user",
		}
	}

	// Check password
	if !checkPassword(password, user.Password) {
		return nil, &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid credentials",
		}
	}

	return us.mapToUserResponse(user), nil
}

// Helper function to map User to UserResponse
func (us *UserService) mapToUserResponse(user models.User) *models.UserResponse {
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
		Posts:     user.Posts,
	}
}
