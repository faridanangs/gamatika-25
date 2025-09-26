package controllers

import (
	"errors"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/go-playground/validator/v10"
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

func (uc *UserController) CreateUser(c *fiber.Ctx) error {
	var req models.CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Errors: []helpers.FieldError{
				{
					Field:   "request",
					Message: "Invalid request body",
					Code:    "INVALID_REQUEST_BODY",
				},
			},
		})
	}
	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	user, err := uc.userService.CreateUser(req)
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			// Check if Details contains a CustomErrorResponse
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

			// Fallback to a generic error response
			return c.Status(appErr.Code).JSON(&helpers.CustomErrorResponse{
				Status:  "error",
				Message: appErr.Message,
				Errors: []helpers.FieldError{
					{
						Field:   "general",
						Message: appErr.Message,
						Code:    "GENERAL_ERROR",
					},
				},
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "An unexpected error occurred",
			Errors: []helpers.FieldError{
				{
					Field:   "system",
					Message: "An unexpected error occurred",
					Code:    "UNEXPECTED_ERROR",
				},
			},
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "User created successfully",
		"data":    user,
	})
}

func (uc *UserController) UpdateUser(c *fiber.Ctx) error {
	var req models.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Errors: []helpers.FieldError{
				{
					Field:   "request",
					Message: "Invalid request body",
					Code:    "INVALID_REQUEST_BODY",
				},
			},
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	req.ID = c.Params("id")

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	user, err := uc.userService.UpdateUser(req, tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "User updated successfully",
		"data":    user,
	})
}

func (uc *UserController) DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	err = uc.userService.DeleteUser(id, tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "User deleted successfully",
	})
}

func (uc *UserController) LoginUser(c *fiber.Ctx) error {
	var req struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6,max=30"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Errors: []helpers.FieldError{
				{
					Field:   "request",
					Message: "Invalid request body",
					Code:    "INVALID_REQUEST_BODY",
				},
			},
		})
	}

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	user, token, err := uc.userService.LoginUser(req.Email, req.Password)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Login successful",
		"data": fiber.Map{
			"user":  user,
			"token": token,
		},
	})
}

func (uc *UserController) GetProfile(c *fiber.Ctx) error {
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	userID, err := uc.userService.ValidateUserToken(tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	user, err := uc.userService.GetUserByID(userID)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Profile retrieved successfully",
		"data":    user,
	})
}

func (uc *UserController) GetAllUsers(c *fiber.Ctx) error {
	users, err := uc.userService.GetAllUsers()
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Users retrieved successfully",
		"data":    users,
	})
}

func (uc *UserController) GetUserByID(c *fiber.Ctx) error {
	id := c.Params("id")

	user, err := uc.userService.GetUserByID(id)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "User retrieved successfully",
		"data":    user,
	})
}

func (uc *UserController) GetCachedTopContributors(c *fiber.Ctx) error {
	res := uc.userService.GetCachedTopContributors()

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Top contributors retrieved successfully",
		"data":    res,
	})
}

func (uc *UserController) GetUserContribution(c *fiber.Ctx) error {
	userID := c.Params("id")

	contribution, err := uc.userService.CalculateUserContribution(userID)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "User contribution retrieved successfully",
		"data":    contribution,
	})
}

func (uc *UserController) GetPrivateKey(c *fiber.Ctx) error {
	var req models.PrivKeyReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Errors: []helpers.FieldError{
				{
					Field:   "request",
					Message: "Invalid request body",
					Code:    "INVALID_REQUEST_BODY",
				},
			},
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	userID, err := uc.userService.ValidateUserToken(tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	privateKey, err := uc.userService.GetPrivateKeyWithPassword(userID, req)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Private key retrieved successfully",
		"data": fiber.Map{
			"private_key": privateKey,
		},
	})
}
