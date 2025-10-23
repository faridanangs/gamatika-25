package services

import (
	"encoding/json"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type ArtikelService struct {
	db             *gorm.DB
	us             *UserService
	dbErrorHandler *helpers.DatabaseErrorHandler
}

func NewArtikelService(db *gorm.DB, us *UserService) *ArtikelService {
	return &ArtikelService{
		db:             db,
		us:             us,
		dbErrorHandler: helpers.NewDatabaseErrorHandler(),
	}
}

func (as *ArtikelService) Create(req *models.ArtikelRequest, token string) (*models.ArtikelResponse, error) {
	userID, err := as.us.ValidateUserToken(token)
	if err != nil {
		return nil, err
	}

	tags, _ := json.Marshal(req.Tags)

	artikel := models.Artikel{
		ID:       uuid.New().String(),
		Title:    req.Title,
		Category: req.Category,
		Tags:     datatypes.JSON(tags),
		Content:  req.Content,
		UserID:   userID,
	}

	if err := as.db.Create(&artikel).Error; err != nil {
		return nil, as.dbErrorHandler.HandleError(err, "artikel creation")
	}

	return helpers.MapToArtikelResponse(artikel), nil
}

func (as *ArtikelService) Delete(id, token string) error {
	claims, err := middleware.ValidateJWT(token)
	if err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	var artikel models.Artikel
	if err := as.db.Preload("Author").Where("id = ?", id).First(&artikel).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Artikel not found or you don't have permission to delete this artikel",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Artikel not found or you don't have permission to delete this artikel",
					Errors: []helpers.FieldError{
						{
							Field:   "artikel",
							Message: "Artikel not found or you don't have permission to delete this artikel",
							Code:    "POST_NOT_FOUND_OR_UNAUTHORIZED",
						},
					},
				},
			}
		}
		return as.dbErrorHandler.HandleError(err, "Artikel lookup")
	}

	if artikel.Author.ID != claims.UserID && claims.Role != "admin" {
		return &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only delete your own artikel",
		}
	}

	if err := as.db.Unscoped().Where("id = ?", id).Delete(&models.Artikel{}).Error; err != nil {
		return as.dbErrorHandler.HandleError(err, "delete artikel")
	}

	return nil
}

func (as *ArtikelService) GetByID(id string) (*models.ArtikelResponse, error) {
	var artikel models.Artikel

	if err := as.db.Preload("Author").Where("id = ?", id).Find(&artikel).Error; err != nil {
		return nil, as.dbErrorHandler.HandleError(err, "get artikel by id")
	}

	return helpers.MapToArtikelResponse(artikel), nil
}

func (as *ArtikelService) GetAll() ([]models.ArtikelResponse, error) {
	var artikels []models.Artikel

	if err := as.db.Preload("Author").Find(&artikels).Error; err != nil {
		return nil, as.dbErrorHandler.HandleError(err, "Get All Artikel")
	}

	resps := make([]models.ArtikelResponse, len(artikels))

	for i, res := range artikels {
		resps[i] = *helpers.MapToArtikelResponse(res)
	}

	return resps, nil
}
