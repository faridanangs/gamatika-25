package controllers

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type ArtikelController struct {
	as  *services.ArtikelService
	val *validator.Validate
}

func NewArtikelController(as *services.ArtikelService, val *validator.Validate) *ArtikelController {
	return &ArtikelController{
		as:  as,
		val: val,
	}
}

func (ac *ArtikelController) Create(c *fiber.Ctx) error {
	var req models.ArtikelRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Errors: []helpers.FieldError{
				{
					Field:   "request",
					Message: "Invalid request body",
					Code:    "INVALID_REQUEST_BODY",
				},
			},
		})
	}

	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	if helpers.HandleValidationErrors(ac.val, &req, c) {
		return nil
	}

	resp, err := ac.as.Create(&req, tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Artikel created successfully",
		"data":    resp,
	})
}

func (ac *ArtikelController) GetArtikelByID(c *fiber.Ctx) error {
	id := c.Params("id")
	resp, err := ac.as.GetArtikelByID(id)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Artikel retrieved successfully",
		"data":    resp,
	})
}

func (ac *ArtikelController) GetPerPage(c *fiber.Ctx) error {
	limit := c.QueryInt("limit", 6)
	page := c.QueryInt("page", 1)
	category := c.Query("category", "semua")
	q := c.Query("q")

	artikels, count, err := ac.as.GetPerPage(limit, page, category, q)

	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "artikels retrieved successfully",
		"data":    artikels,
		"total":   count,
	})
}

func (ac *ArtikelController) Delete(c *fiber.Ctx) error {
	tokenString, err := helpers.TokenString(c)
	if err != nil {
		return err
	}

	id := c.Params("id")

	err = ac.as.Delete(id, tokenString)
	if err != nil {
		return helpers.HelperErrNotNil(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Artikel deleted successfully",
	})
}
