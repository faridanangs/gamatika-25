package main

import (
	"github.com/gofiber/fiber/v2"
)

// Golang
func main() {
	app := fiber.New(fiber.Config{})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World")
	})

	app.Listen(":8000")
}
