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
	us  *UserService
}

func NewPostService(db *gorm.DB, val *validator.Validate, us *UserService) *PostService {
	return &PostService{
		db:  db,
		val: val,
		us:  us,
	}
}

// CreatePost - Create new post with validation and token verification
func (ps *PostService) CreatePost(req models.CreatePostRequest, tokenString string) (*models.PostResponse, error) {
	// Validate token and get user
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Validate request
	if err := ps.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Check if user exists
	var userExists models.User
	if err := ps.db.Where("id = ?", userID).First(&userExists).Error; err != nil {
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
		UserID:       userID,
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

// UpdatePost - Update existing post with token verification
func (ps *PostService) UpdatePost(req models.UpdatePostRequest, tokenString string) (*models.PostResponse, error) {
	// Validate token and get user
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Validate request
	if err := ps.val.Struct(req); err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Validation failed: " + err.Error(),
		}
	}

	// Find post and check ownership
	var post models.Post
	if err := ps.db.Where("id = ? AND user_id = ?", req.ID, userID).First(&post).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found or you don't have permission to update this post",
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
	if !req.Updated {
		post.Updated = true
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

// DeletePost - Delete post with token verification
func (ps *PostService) DeletePost(id string, tokenString string) error {
	// Validate token and get user
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return err
	}

	// Find post and check ownership
	var post models.Post
	if err := ps.db.Where("id = ? AND user_id = ?", id, userID).First(&post).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found or you don't have permission to delete this post",
			}
		}
		return &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to find post",
		}
	}

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
	if err := tx.Delete(&post).Error; err != nil {
		tx.Rollback()
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

// GetPostByID - Get post by ID with author and comments
func (ps *PostService) GetPostByID(id string) (*models.PostResponse, error) {
	var post models.Post
	// Hanya ambil field yang diperlukan untuk author dan comments author
	if err := ps.db.Preload("Author").
		Preload("Comments").
		Preload("Comments.Author").
		Where("id = ?", id).First(&post).Error; err != nil {
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
	// Hanya ambil field yang diperlukan untuk author dan comments author
	if err := ps.db.Preload("Author").
		Preload("Comments").
		Preload("Comments.Author").
		Find(&posts).Error; err != nil {
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

// Helper function to map User to AuthorResponse
func (ps *PostService) mapToAuthorResponse(user models.User) models.AuthorResponse {
	return models.AuthorResponse{
		ID:       user.ID,
		Username: user.Username,
		Avatar:   user.Avatar,
	}
}

// Helper function to map Post to PostResponse
func (ps *PostService) mapToPostResponse(post models.Post) *models.PostResponse {
	// Map comments to CommentResponse
	commentResponses := make([]models.CommentResponse, len(post.Comments))
	for i, comment := range post.Comments {
		commentResponses[i] = ps.mapToCommentResponse(comment)
	}

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
		Author:       ps.mapToAuthorResponse(post.Author),
		Comments:     commentResponses,
	}
}

// Helper function to map Comment to CommentResponse
func (ps *PostService) mapToCommentResponse(comment models.Comment) models.CommentResponse {
	return models.CommentResponse{
		ID:        comment.ID,
		Author:    ps.mapToAuthorResponse(comment.Author),
		Content:   comment.Content,
		Image:     comment.Image,
		Updated:   comment.Updated,
		CreatedAt: comment.CreatedAt,
		UpdatedAt: comment.UpdatedAt,
	}
}
