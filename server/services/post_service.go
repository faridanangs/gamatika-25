package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostService struct {
	db  *gorm.DB
	val *validator.Validate
}

func NewPostService(db *gorm.DB, val *validator.Validate) *PostService {
	return &PostService{
		db:  db,
		val: val,
	}
}

// CreatePost - Create new post with validation
func (ps *PostService) CreatePost(req models.CreatePostRequest) (*models.PostResponse, error) {
	// Validate request
	if err := ps.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Check if user exists
	var user models.User
	if err := ps.db.Where("id = ?", req.UserID).First(&user).Error; err != nil {
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

	// Generate post ID
	postID := uuid.New().String()

	// Create post
	post := models.Post{
		ID:           postID,
		Title:        req.Title,
		Content:      req.Content,
		Category:     req.Category,
		Image:        req.Image,
		LikeCount:    0,
		CommentCount: 0,
		ShareCount:   0,
		Updated:      false,
		UserID:       req.UserID,
	}

	// Insert post
	if err := ps.db.Create(&post).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to create post",
		}
	}

	// Prepare response
	return ps.mapToPostResponse(post), nil
}

// GetPostByID - Get post by ID with author and comments
func (ps *PostService) GetPostByID(id string) (*models.PostResponse, error) {

	var post models.Post
	if err := ps.db.Preload("Author").Preload("Comments").Preload("Comments.Author").Where("id = ?", id).First(&post).Error; err != nil {
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

	return ps.mapToPostResponse(post), nil
}

// GetAllPosts - Get all posts with authors and comments
func (ps *PostService) GetAllPosts() ([]models.PostResponse, error) {
	var posts []models.Post
	if err := ps.db.Preload("Author").Preload("Comments").Preload("Comments.Author").Find(&posts).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to get posts",
		}
	}

	responses := make([]models.PostResponse, len(posts))
	for i, post := range posts {
		responses[i] = *ps.mapToPostResponse(post)
	}

	return responses, nil
}

// UpdatePost - Update existing post
func (ps *PostService) UpdatePost(req models.UpdatePostRequest) (*models.PostResponse, error) {
	// Validate request
	if err := ps.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Find post
	var post models.Post
	if err := ps.db.Where("id = ?", req.ID).First(&post).Error; err != nil {
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

	// Update fields if provided
	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Content != "" {
		post.Content = req.Content
	}
	if req.Updated {
		post.Updated = req.Updated
	}

	// Save changes
	if err := ps.db.Save(&post).Error; err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to update post",
		}
	}

	// Prepare response
	return ps.mapToPostResponse(post), nil
}

// DeletePost - Delete post with comments
func (ps *PostService) DeletePost(id string) error {
	// Start transaction
	tx := ps.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Delete all comments associated with the post
	if err := tx.Where("post_id = ?", id).Delete(&models.Comment{}).Error; err != nil {
		tx.Rollback()
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to delete post's comments",
		}
	}

	// Delete the post
	if err := tx.Delete(&models.Post{}, id).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found",
			}
		}
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to delete post",
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to commit transaction",
		}
	}

	return nil
}

// Helper function to map Post to PostResponse
func (ps *PostService) mapToPostResponse(post models.Post) *models.PostResponse {
	return &models.PostResponse{
		ID:           post.ID,
		Title:        post.Title,
		Content:      post.Content,
		Category:     post.Category,
		Image:        post.Image,
		LikeCount:    post.LikeCount,
		CommentCount: post.CommentCount,
		ShareCount:   post.ShareCount,
		Updated:      post.Updated,
		CreatedAt:    post.CreatedAt,
		UpdatedAt:    post.UpdatedAt,
		Author:       post.Author,
		Comments:     post.Comments,
	}
}
