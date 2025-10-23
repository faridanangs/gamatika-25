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
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

// Golang
func main() {
	if err := godotenv.Load(); err != nil {
		log.Panic(err)
	}

	jwtSecret := os.Getenv("JWT_SECRET")

	middleware.SetJWTSecret(jwtSecret)

	app := fiber.New(fiber.Config{})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New())

	// Initialize validator
	validator := validator.New()
	db := database.Connect()

	// Initialize services
	userService := services.NewUserService(db, validator)
	postService := services.NewPostService(db, validator, userService)
	commentService := services.NewCommentService(db, validator, userService)
	artikelService := services.NewArtikelService(db, userService)

	// Initialize controllers
	userController := controllers.NewUserController(userService)
	postController := controllers.NewPostController(postService, commentService)
	artikelController := controllers.NewArtikelController(artikelService, validator)

	// Setup all routes
	routes.SetupRoutes(app, userController, postController, artikelController)

	// Start server
	log.Fatal(app.Listen(":8080"))
}
