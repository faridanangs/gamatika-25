package main

import (
	"log"
	"os"

	"github.com/faridanangs/gamatika-25/controllers"
	"github.com/faridanangs/gamatika-25/database"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/faridanangs/gamatika-25/routes"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

// Golang
func main() {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-here"
	}
	middleware.SetJWTSecret(jwtSecret)

	app := fiber.New(fiber.Config{})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	// app.Use(cors.New())

	// Initialize validator
	validator := validator.New()
	db := database.Connect()

	// Initialize services
	userService := services.NewUserService(db, validator)
	postService := services.NewPostService(db, validator, userService)
	commentService := services.NewCommentService(db, validator, userService)

	// Initialize controllers
	userController := controllers.NewUserController(userService)
	postController := controllers.NewPostController(postService, commentService)

	// Setup all routes
	routes.SetupRoutes(app, userController, postController)

	// Start server
	log.Fatal(app.Listen(":8080"))
}
