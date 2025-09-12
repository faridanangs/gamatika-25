package main

import (
	"log"

	"github.com/faridanangs/gamatika-25/controllers"
	"github.com/faridanangs/gamatika-25/database"
	"github.com/faridanangs/gamatika-25/routes"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// Golang
func main() {
	app := fiber.New(fiber.Config{})

	// Initialize validator
	validator := validator.New()
	db := database.Connect()

	// Initialize services
	userService := services.NewUserService(db, validator)
	postService := services.NewPostService(db, validator)
	commentService := services.NewCommentService(db, validator)

	// Initialize controllers
	userController := controllers.NewUserController(userService)
	postController := controllers.NewPostController(postService, commentService)

	// Setup all routes
	routes.SetupRoutes(app, userController, postController)

	// Start server
	log.Fatal(app.Listen(":3000"))
}
