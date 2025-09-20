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
	db             *gorm.DB
	val            *validator.Validate
	us             *UserService
	dbErrorHandler *helpers.DatabaseErrorHandler
}

func NewCommentService(db *gorm.DB, val *validator.Validate, us *UserService) *CommentService {
	return &CommentService{
		db:             db,
		val:            val,
		us:             us,
		dbErrorHandler: helpers.NewDatabaseErrorHandler(),
	}
}

// CreateComment - Create new comment with token verification
func (cs *CommentService) CreateComment(req models.CreateCommentRequest, tokenString string) (*models.CommentResponse, error) {
	userID, err := cs.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Convert IDs to UUID
	postID, err := uuid.Parse(req.PostID)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Invalid post ID format",
			Details: &helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Invalid post ID format",
				Errors: []helpers.FieldError{
					{
						Field:   "post_id",
						Message: "Invalid post ID format",
						Code:    "INVALID_POST_ID_FORMAT",
					},
				},
			},
		}
	}

	// Check if post exists
	var post models.Post
	if err := cs.db.First(&post, postID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Post not found",
					Errors: []helpers.FieldError{
						{
							Field:   "post",
							Message: "Post not found",
							Code:    "POST_NOT_FOUND",
						},
					},
				},
			}
		}
		return nil, cs.dbErrorHandler.HandleError(err, "Post lookup")
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
	if err := cs.db.Preload("Author").Create(&comment).Error; err != nil {
		return nil, cs.dbErrorHandler.HandleError(err, "Comment creation")
	}

	// Update comment count in post
	if err := cs.db.Model(&post).Update("comment_count", post.CommentCount+1).Error; err != nil {
		return nil, cs.dbErrorHandler.HandleError(err, "Comment count update")
	}

	if err = cs.db.Preload("Author").First(&comment, comment.ID).Error; err != nil {
		return nil, cs.dbErrorHandler.HandleError(err, "Comment retrieval")
	}

	// Prepare response
	return helpers.MapToCommentResponse(comment), nil
}

// UpdateComment - Update existing comment with token verification
func (cs *CommentService) UpdateComment(req models.UpdateCommentRequest, tokenString string) (*models.CommentResponse, error) {
	// Validate token and get user
	userID, err := cs.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Find comment and check ownership
	var comment models.Comment
	if err := cs.db.Where("id = ? AND user_id = ?", req.ID, userID).First(&comment).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found or you don't have permission to update this comment",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Comment not found or you don't have permission to update this comment",
					Errors: []helpers.FieldError{
						{
							Field:   "comment",
							Message: "Comment not found or you don't have permission to update this comment",
							Code:    "COMMENT_NOT_FOUND_OR_UNAUTHORIZED",
						},
					},
				},
			}
		}
		return nil, cs.dbErrorHandler.HandleError(err, "Comment lookup")
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
		return nil, cs.dbErrorHandler.HandleError(err, "Comment update")
	}

	return helpers.MapToCommentResponse(comment), nil
}

// DeleteComment - Delete comment with token verification
func (cs *CommentService) DeleteComment(id uint64, tokenString string) error {
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
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Comment not found or you don't have permission to delete this comment",
					Errors: []helpers.FieldError{
						{
							Field:   "comment",
							Message: "Comment not found or you don't have permission to delete this comment",
							Code:    "COMMENT_NOT_FOUND_OR_UNAUTHORIZED",
						},
					},
				},
			}
		}
		return cs.dbErrorHandler.HandleError(err, "Comment lookup")
	}

	// Update comment count in post
	if err := cs.db.Model(&models.Post{}).Where("id = ?", comment.PostID).Update("comment_count", gorm.Expr("comment_count - 1")).Error; err != nil {
		return cs.dbErrorHandler.HandleError(err, "Comment count update")
	}

	// Delete the comment
	if err := cs.db.Delete(&comment).Error; err != nil {
		return cs.dbErrorHandler.HandleError(err, "Comment deletion")
	}

	return nil
}

// GetCommentByID - Get comment by ID with author
func (cs *CommentService) GetCommentByID(id uint64) (*models.CommentResponse, error) {
	var comment models.Comment
	if err := cs.db.Where("id = ?", id).Preload("Author").First(&comment).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Comment not found",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Comment not found",
					Errors: []helpers.FieldError{
						{
							Field:   "comment",
							Message: "Comment not found",
							Code:    "COMMENT_NOT_FOUND",
						},
					},
				},
			}
		}
		return nil, cs.dbErrorHandler.HandleError(err, "Comment retrieval")
	}

	return helpers.MapToCommentResponse(comment), nil
}

// GetAllComments - Get all comments with authors
func (cs *CommentService) GetAllComments() ([]models.CommentResponse, error) {
	var comments []models.Comment
	if err := cs.db.Preload("Author").Find(&comments).Error; err != nil {
		return nil, cs.dbErrorHandler.HandleError(err, "Comments retrieval")
	}

	responses := make([]models.CommentResponse, len(comments))
	for i, comment := range comments {
		responses[i] = *helpers.MapToCommentResponse(comment)
	}

	return responses, nil
}
