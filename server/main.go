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

func main() {
	appEnv := os.Getenv("APP_ENV")
	if appEnv != "production" {
		if err := godotenv.Load(".env.local"); err != nil {
			log.Println("Peringatan: Tidak dapat memuat file .env")
		}
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Panic("FATAL: JWT_SECRET tidak diatur di environment variable")
	}

	middleware.SetJWTSecret(jwtSecret)

	app := fiber.New(fiber.Config{})

	if appEnv != "production" {
		app.Use(logger.New())
	}

	app.Use(recover.New())

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" && appEnv == "production" {
		log.Println("Peringatan: FRONTEND_URL tidak di-set, CORS mungkin gagal")
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     frontendURL + ", http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE",
		AllowCredentials: true,
	}))

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

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server berjalan di port %s\n", port)
	log.Fatal(app.Listen(":" + port))
}
