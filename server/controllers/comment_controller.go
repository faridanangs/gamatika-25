package controllers

import (
	"errors"
	"strconv"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// Comment routes
func (pc *PostController) CreateComment(c *fiber.Ctx) error {
	var req models.CreateCommentRequest
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

	req.PostID = c.Params("id")
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	comment, err := pc.commentService.CreateComment(req, tokenString)
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

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
		"message": "Comment created successfully",
		"data":    comment,
	})
}

// UpdateComment - Handle comment update request
func (pc *PostController) UpdateComment(c *fiber.Ctx) error {
	var req models.UpdateCommentRequest
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

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid comment ID",
			Errors: []helpers.FieldError{
				{
					Field:   "id",
					Message: "Invalid comment ID",
					Code:    "INVALID_COMMENT_ID",
				},
			},
		})
	}

	req.ID = id

	comment, err := pc.commentService.UpdateComment(req, tokenString)
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

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

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Comment updated successfully",
		"data":    comment,
	})
}

// DeleteComment - Handle comment deletion request
func (pc *PostController) DeleteComment(c *fiber.Ctx) error {
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid comment ID",
			Errors: []helpers.FieldError{
				{
					Field:   "id",
					Message: "Invalid comment ID",
					Code:    "INVALID_COMMENT_ID",
				},
			},
		})
	}

	err = pc.commentService.DeleteComment(id, tokenString)
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

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

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Comment deleted successfully",
	})
}

func (pc *PostController) GetCommentByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid comment ID",
			Errors: []helpers.FieldError{
				{
					Field:   "id",
					Message: "Invalid comment ID",
					Code:    "INVALID_COMMENT_ID",
				},
			},
		})
	}

	comment, err := pc.commentService.GetCommentByID(id)
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

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

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Comment retrieved successfully",
		"data":    comment,
	})
}

func (pc *PostController) GetAllComments(c *fiber.Ctx) error {
	comments, err := pc.commentService.GetAllComments()
	if err != nil {
		var appErr *helpers.AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

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

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Comments retrieved successfully",
		"data":    comments,
	})
}
