package controllers

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/gofiber/fiber/v2"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

// CreateUser - Handle user creation request
func (uc *UserController) CreateUser(c *fiber.Ctx) error {
	var req models.CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := uc.userService.CreateUser(req)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}

// GetAllUsers - Handle get all users request
func (uc *UserController) GetAllUsers(c *fiber.Ctx) error {
	users, err := uc.userService.GetAllUsers()
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(users)
}

// GetUserByID - Handle get user by ID request
func (uc *UserController) GetUserByID(c *fiber.Ctx) error {
	id := c.Params("id")
	user, err := uc.userService.GetUserByID(id)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(user)
}

// UpdateUser - Handle user update request
func (uc *UserController) UpdateUser(c *fiber.Ctx) error {
	var req models.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Set ID from URL parameter
	req.ID = c.Params("id")

	user, err := uc.userService.UpdateUser(req)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(user)
}

// DeleteUser - Handle user deletion request
func (uc *UserController) DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	err := uc.userService.DeleteUser(id)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User deleted successfully",
	})
}

// LoginUser - Handle user login request
func (uc *UserController) LoginUser(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username" validate:"required"`
		Password string `json:"password" validate:"required"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	user, err := uc.userService.LoginUser(req.Username, req.Password)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(user)
}
