package controllers

import (
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
		return helpers.HelperErrNotNil(err, c)
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
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Post retrieved successfully",
		"data":    post,
	})
}

func (pc *PostController) GetPostPerPage(c *fiber.Ctx) error {
	page := c.QueryInt("page", 0)
	limit := c.QueryInt("limit", 10)
	category := c.Query("category", "Semua")
	q := c.Query("query")

	posts, err := pc.postService.GetPostPerPage(page, limit, category, q)

	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Posts retrieved successfully",
		"data":    posts,
	})
}

func (pc *PostController) GetPostCommentPerPage(c *fiber.Ctx) error {
	id := c.Params("id")
	page := c.QueryInt("page", 0)
	limit := c.QueryInt("limit", 10)

	posts, count, err := pc.postService.GetPostCommentPerPage(id, page, limit)

	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Posts retrieved successfully",
		"data":    posts,
		"total":   count,
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
		return helpers.HelperErrNotNil(err, c)
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
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Post deleted successfully",
	})
}

func (pc *PostController) ToggleLike(c *fiber.Ctx) error {
	postID := c.Params("id")
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	post, err := pc.postService.ToggleLike(postID, tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Like toggled successfully",
		"data":    post,
	})
}
