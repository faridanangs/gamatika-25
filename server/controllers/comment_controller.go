package controllers

import (
	"strconv"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/gofiber/fiber/v2"
)

// Comment routes
func (pc *PostController) CreateComment(c *fiber.Ctx) error {
	var req models.CreateCommentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Set post ID from URL parameter
	req.PostID = c.Params("id")
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	comment, err := pc.commentService.CreateComment(req, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(comment)
}

// UpdateComment - Handle comment update request
func (pc *PostController) UpdateComment(c *fiber.Ctx) error {
	var req models.UpdateCommentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	req.ID = id

	comment, err := pc.commentService.UpdateComment(req, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(comment)
}

// DeleteComment - Handle comment deletion request
func (pc *PostController) DeleteComment(c *fiber.Ctx) error {
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	err = pc.commentService.DeleteComment(id, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Comment deleted successfully",
	})
}

func (pc *PostController) GetCommentByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	comment, err := pc.commentService.GetCommentByID(id)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(comment)
}

func (pc *PostController) GetAllComments(c *fiber.Ctx) error {
	comments, err := pc.commentService.GetAllComments()
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(comments)
}
