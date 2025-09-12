package routes

import (
	"github.com/faridanangs/gamatika-25/controllers"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes - Setup all routes for the application
func SetupRoutes(app *fiber.App, userController *controllers.UserController, postController *controllers.PostController) {
	// User routes
	userRoutes(app, userController)

	// Post routes
	postRoutes(app, postController)
}

// userRoutes - Setup user related routes
func userRoutes(app *fiber.App, userController *controllers.UserController) {
	// User CRUD operations
	app.Post("/users", userController.CreateUser)
	app.Get("/users", userController.GetAllUsers)
	app.Get("/users/:id", userController.GetUserByID)
	app.Put("/users/:id", userController.UpdateUser)
	app.Delete("/users/:id", userController.DeleteUser)

	// User authentication
	app.Post("/login", userController.LoginUser)
}

// postRoutes - Setup post related routes
func postRoutes(app *fiber.App, postController *controllers.PostController) {
	// Post CRUD operations
	app.Post("/posts", postController.CreatePost)
	app.Get("/posts", postController.GetAllPosts)
	app.Get("/posts/:id", postController.GetPostByID)
	app.Put("/posts/:id", postController.UpdatePost)
	app.Delete("/posts/:id", postController.DeletePost)

	// Comment routes (nested under posts)
	commentRoutes(app, postController)
}

// commentRoutes - Setup comment related routes
func commentRoutes(app *fiber.App, postController *controllers.PostController) {
	// Comment CRUD operations
	app.Post("/posts/:id/comments", postController.CreateComment)
	app.Get("/comments", postController.GetAllComments)
	app.Get("/comments/:id", postController.GetCommentByID)
	app.Put("/comments/:id", postController.UpdateComment)
	app.Delete("/comments/:id", postController.DeleteComment)
}
