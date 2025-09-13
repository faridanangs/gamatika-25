package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CommentService struct {
	db  *gorm.DB
	val *validator.Validate
	us  *UserService
}

func NewCommentService(db *gorm.DB, val *validator.Validate, us *UserService) *CommentService {
	return &CommentService{
		db:  db,
		val: val,
		us:  us,
	}
}

// CreateComment - Create new comment with validation
// CreateComment - Create new comment with token verification
func (cs *CommentService) CreateComment(req models.CreateCommentRequest, tokenString string) (*models.CommentResponse, error) {
	// Validate token and get user
	userID, err := cs.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Validate request
	if err := cs.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Convert IDs to UUID
	postID, err := uuid.Parse(req.PostID)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Invalid post ID format",
		}
	}

	// Check if post exists
	var post models.Post
	if err := cs.db.First(&post, postID).Error; err != nil {
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

	// Create comment
	comment := models.Comment{
		Content: req.Content,
		Image:   req.Image,
		Updated: false,
		PostID:  req.PostID,
		UserID:  userID,
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

// UpdateComment - Update existing comment with token verification
func (cs *CommentService) UpdateComment(req models.UpdateCommentRequest, tokenString string) (*models.CommentResponse, error) {
	// Validate token and get user
	userID, err := cs.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Validate request
	if err := cs.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Find comment and check ownership
	var comment models.Comment
	if err := cs.db.Where("id = ? AND user_id = ?", req.ID, userID).First(&comment).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found or you don't have permission to update this comment",
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
	if !req.Updated {
		comment.Updated = true
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

// DeleteComment - Delete comment with token verification
func (cs *CommentService) DeleteComment(id uint64, tokenString string) error {
	// Validate token and get user
	userID, err := cs.us.ValidateUserToken(tokenString)
	if err != nil {
		return err
	}

	// Find comment and check ownership
	var comment models.Comment
	if err := cs.db.Where("id = ? AND user_id = ?", id, userID).First(&comment).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found or you don't have permission to delete this comment",
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

// GetCommentByID - Get comment by ID with author
func (cs *CommentService) GetCommentByID(id uint64) (*models.CommentResponse, error) {
	var comment models.Comment
	// Hanya ambil field yang diperlukan untuk author
	if err := cs.db.Where("id = ?", id).Preload("Author").First(&comment).Error; err != nil {
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
	// Hanya ambil field yang diperlukan untuk author
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

// Helper function to map User to AuthorResponse
func (cs *CommentService) mapToAuthorResponse(user models.User) models.AuthorResponse {
	return models.AuthorResponse{
		ID:       user.ID,
		Username: user.Username,
		Avatar:   user.Avatar,
	}
}

// Helper function to map Comment to CommentResponse
func (cs *CommentService) mapToCommentResponse(comment models.Comment) *models.CommentResponse {
	return &models.CommentResponse{
		ID:        comment.ID,
		Author:    cs.mapToAuthorResponse(comment.Author),
		Content:   comment.Content,
		Image:     comment.Image,
		Updated:   comment.Updated,
		CreatedAt: comment.CreatedAt,
		UpdatedAt: comment.UpdatedAt,
	}
}
