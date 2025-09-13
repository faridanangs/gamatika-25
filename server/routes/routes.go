package routes

import (
	"github.com/faridanangs/gamatika-25/controllers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes - Setup all routes for the application
func SetupRoutes(app *fiber.App, userController *controllers.UserController, postController *controllers.PostController) {
	// Public routes
	app.Post("/users", userController.CreateUser)
	app.Post("/login", userController.LoginUser)
	app.Get("/posts", postController.GetAllPosts)

	// Protected routes
	protected := app.Group("/api")
	protected.Use(middleware.JWTProtected())
	{
		// User routes
		protected.Get("/users", userController.GetAllUsers)
		protected.Get("/users/:id", userController.GetUserByID)
		protected.Put("/users/:id", userController.UpdateUser)
		protected.Delete("/users/:id", userController.DeleteUser)
		// protected.Get("/profile", userController.GetProfile)

		// Post routes
		protected.Post("/posts", postController.CreatePost)
		protected.Get("/posts/:id", postController.GetPostByID)
		protected.Put("/posts/:id", postController.UpdatePost)
		protected.Delete("/posts/:id", postController.DeletePost)

		// Comment routes
		protected.Post("/posts/:id/comments", postController.CreateComment)
		protected.Get("/comments", postController.GetAllComments)
		protected.Get("/comments/:id", postController.GetCommentByID)
		protected.Put("/comments/:id", postController.UpdateComment)
		protected.Delete("/comments/:id", postController.DeleteComment)
	}
}
