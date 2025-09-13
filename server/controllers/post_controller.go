package controllers

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/services"
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

// Post routes
func (pc *PostController) SetupRoutes(app *fiber.App) {

	// Post routes
	app.Post("/posts", pc.CreatePost)
	app.Get("/posts", pc.GetAllPosts)
	app.Get("/posts/:id", pc.GetPostByID)
	app.Put("/posts/:id", pc.UpdatePost)
	app.Delete("/posts/:id", pc.DeletePost)

	// Comment routes
	app.Post("/posts/:id/comments", pc.CreateComment)
	app.Get("/comments", pc.GetAllComments)
	app.Get("/comments/:id", pc.GetCommentByID)
	app.Put("/comments/:id", pc.UpdateComment)
	app.Delete("/comments/:id", pc.DeleteComment)
}

func (pc *PostController) CreatePost(c *fiber.Ctx) error {
	var req models.CreatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	post, err := pc.postService.CreatePost(req, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(post)
}

func (pc *PostController) GetPostByID(c *fiber.Ctx) error {
	id := c.Params("id")
	post, err := pc.postService.GetPostByID(id)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(post)
}

func (pc *PostController) GetAllPosts(c *fiber.Ctx) error {
	posts, err := pc.postService.GetAllPosts()
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(posts)
}

func (pc *PostController) UpdatePost(c *fiber.Ctx) error {
	var req models.UpdatePostRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	// Get user ID from JWT middleware
	req.ID = c.Params("id")

	post, err := pc.postService.UpdatePost(req, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(post)
}

func (pc *PostController) DeletePost(c *fiber.Ctx) error {

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id := c.Params("id")

	err = pc.postService.DeletePost(id, tokenString)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Post deleted successfully",
	})
}
