package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CommentService struct {
	db  *gorm.DB
	val *validator.Validate
}

func NewCommentService(db *gorm.DB, val *validator.Validate) *CommentService {
	return &CommentService{
		db:  db,
		val: val,
	}
}

// CreateComment - Create new comment with validation
func (cs *CommentService) CreateComment(req models.CreateCommentRequest) (*models.CommentResponse, error) {
	// Validate request
	if err := cs.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Check if post exists
	var post models.Post
	if err := cs.db.Where("id = ?", req.PostID).First(&post).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find post",
		}
	}

	// Check if user exists
	var user models.User
	if err := cs.db.Where("id = ?", req.UserID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find user",
		}
	}

	// Create comment
	comment := models.Comment{
		Content: req.Content,
		Image:   req.Image,
		Updated: false,
		PostID:  req.PostID,
		UserID:  req.UserID,
	}

	// Insert comment
	if err := cs.db.Create(&comment).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create comment",
		}
	}

	// Update comment count in post
	if err := cs.db.Model(&post).Update("comment_count", post.CommentCount+1).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update comment count",
		}
	}

	// Prepare response
	return cs.mapToCommentResponse(comment), nil
}

// GetCommentByID - Get comment by ID with author
func (cs *CommentService) GetCommentByID(id uint64) (*models.CommentResponse, error) {
	var comment models.Comment
	if err := cs.db.Preload("Author").First(&comment, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find comment",
		}
	}

	return cs.mapToCommentResponse(comment), nil
}

// GetAllComments - Get all comments with authors
func (cs *CommentService) GetAllComments() ([]models.CommentResponse, error) {
	var comments []models.Comment
	if err := cs.db.Preload("Author").Find(&comments).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get comments",
		}
	}

	responses := make([]models.CommentResponse, len(comments))
	for i, comment := range comments {
		responses[i] = *cs.mapToCommentResponse(comment)
	}

	return responses, nil
}

// UpdateComment - Update existing comment
func (cs *CommentService) UpdateComment(req models.UpdateCommentRequest) (*models.CommentResponse, error) {
	// Validate request
	if err := cs.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Find comment
	var comment models.Comment
	if err := cs.db.First(&comment, req.ID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found",
			}
		}
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find comment",
		}
	}

	// Update fields if provided
	if req.Content != "" {
		comment.Content = req.Content
	}
	if req.Updated {
		comment.Updated = req.Updated
	}

	// Save changes
	if err := cs.db.Save(&comment).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update comment",
		}
	}

	// Prepare response
	return cs.mapToCommentResponse(comment), nil
}

// DeleteComment - Delete comment
func (cs *CommentService) DeleteComment(id uint64) error {
	// Find comment
	var comment models.Comment
	if err := cs.db.First(&comment, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found",
			}
		}
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find comment",
		}
	}

	// Update comment count in post
	if err := cs.db.Model(&models.Post{}).Where("id = ?", comment.PostID).Update("comment_count", gorm.Expr("comment_count - 1")).Error; err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update comment count",
		}
	}

	// Delete the comment
	if err := cs.db.Delete(&comment).Error; err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to delete comment",
		}
	}

	return nil
}

// Helper function to map Comment to CommentResponse
func (cs *CommentService) mapToCommentResponse(comment models.Comment) *models.CommentResponse {
	return &models.CommentResponse{
		ID:        comment.ID,
		Author:    comment.Author,
		Content:   comment.Content,
		Image:     comment.Image,
		Updated:   comment.Updated,
		CreatedAt: comment.CreatedAt,
		UpdatedAt: comment.UpdatedAt,
	}
}
