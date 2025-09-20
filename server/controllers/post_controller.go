package controllers

import (
	"errors"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type PostController struct {
	postService    *services.PostService
	commentService *services.CommentService
}

func NewPostController(postService *services.PostService, commentService *services.CommentService) *PostController {
	return &PostController{
		postService:    postService,
		commentService: commentService,
	}
}

func (pc *PostController) CreatePost(c *fiber.Ctx) error {
	var req models.CreatePostRequest
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

	post, err := pc.postService.CreatePost(req, tokenString)
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
		"message": "Post created successfully",
		"data":    post,
	})
}

func (pc *PostController) GetPostByID(c *fiber.Ctx) error {
	id := c.Params("id")
	post, err := pc.postService.GetPostByID(id)
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

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Post retrieved successfully",
		"data":    post,
	})
}

func (pc *PostController) GetAllPosts(c *fiber.Ctx) error {
	posts, err := pc.postService.GetAllPosts()
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

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Posts retrieved successfully",
		"data":    posts,
	})
}

func (pc *PostController) UpdatePost(c *fiber.Ctx) error {
	var req models.UpdatePostRequest
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
	req.ID = c.Params("id")

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	if helpers.HandleValidationErrors(validator.New(), &req, c) {
		return nil
	}

	post, err := pc.postService.UpdatePost(req, tokenString)
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
		"message": "Post updated successfully",
		"data":    post,
	})
}

func (pc *PostController) DeletePost(c *fiber.Ctx) error {
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id := c.Params("id")

	err = pc.postService.DeletePost(id, tokenString)
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
		"message": "Post deleted successfully",
	})
}
