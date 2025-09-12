package controllers

import (
	"strconv"

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

	post, err := pc.postService.CreatePost(req)
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

	req.ID = c.Params("id")
	post, err := pc.postService.UpdatePost(req)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(post)
}

func (pc *PostController) DeletePost(c *fiber.Ctx) error {
	id := c.Params("id")
	err := pc.postService.DeletePost(id)
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

	comment, err := pc.commentService.CreateComment(req)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(comment)
}

func (pc *PostController) GetCommentByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	comment, err := pc.commentService.GetCommentByID(uint64(id))
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

func (pc *PostController) UpdateComment(c *fiber.Ctx) error {
	var req models.UpdateCommentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	req.ID = id
	comment, err := pc.commentService.UpdateComment(req)
	if err != nil {
		appErr := err.(*helpers.AppError)
		return c.Status(appErr.Code).JSON(fiber.Map{
			"error": appErr.Message,
		})
	}

	return c.JSON(comment)
}

func (pc *PostController) DeleteComment(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	err = pc.commentService.DeleteComment(id)
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
