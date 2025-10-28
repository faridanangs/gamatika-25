package routes

import (
	"github.com/faridanangs/gamatika-25/controllers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes - Setup all routes for the application
func SetupRoutes(app *fiber.App, userController *controllers.UserController, postController *controllers.PostController, artikelController *controllers.ArtikelController) {
	// Public routes
	app.Post("/users", userController.CreateUser)
	app.Post("/login", userController.LoginUser)
	app.Get("/posts", postController.GetAllPosts)
	app.Get("/posts/scroll", postController.GetPostPerPage)
	app.Get("/posts/:id", postController.GetPostByID)

	app.Get("/users/top-contributors", userController.GetCachedTopContributors)
	app.Get("/users/:id/contribution", userController.GetUserContribution)
	app.Get("/artikels", artikelController.GetAll)
	app.Get("/artikels/pagination", artikelController.GetPerPage)
	app.Get("/artikels/:id", artikelController.GetByID)

	// Protected routes
	protected := app.Group("/api")
	protected.Use(middleware.JWTProtected())
	{
		// User routes
		protected.Get("/users", userController.GetAllUsers)
		protected.Get("/users/profile", userController.GetProfile)
		protected.Post("/users/private-key", userController.GetPrivateKey)
		protected.Get("/users/:id", userController.GetUserByID)
		protected.Put("/users/:id", userController.UpdateUser)
		protected.Delete("/users/:id", userController.DeleteUser)

		// Post routes
		protected.Post("/posts", postController.CreatePost)
		protected.Post("/posts/:id/like", postController.ToggleLike)
		protected.Put("/posts/:id", postController.UpdatePost)
		protected.Delete("/posts/:id", postController.DeletePost)

		// Comment routes
		protected.Post("/posts/:id/comments", postController.CreateComment)
		protected.Get("/comments", postController.GetAllComments)
		protected.Get("/comments/:id", postController.GetCommentByID)
		protected.Put("/comments/:id", postController.UpdateComment)
		protected.Delete("/comments/:id", postController.DeleteComment)

		// Artikels routes
		protected.Post("/artikels", artikelController.Create)
		protected.Delete("/artikels/:id", artikelController.Delete)
	}
}
