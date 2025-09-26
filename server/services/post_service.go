package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PostService struct {
	db             *gorm.DB
	val            *validator.Validate
	us             *UserService
	dbErrorHandler *helpers.DatabaseErrorHandler
}

func NewPostService(db *gorm.DB, val *validator.Validate, us *UserService) *PostService {
	return &PostService{
		db:             db,
		val:            val,
		us:             us,
		dbErrorHandler: helpers.NewDatabaseErrorHandler(),
	}
}

// CreatePost - Create new post with validation and token verification
func (ps *PostService) CreatePost(req models.CreatePostRequest, tokenString string) (*models.PostResponse, error) {
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Check if user exists
	var userExists models.User
	if err := ps.db.Where("id = ?", userID).First(&userExists).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "User not found",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "User not found",
					Errors: []helpers.FieldError{
						{
							Field:   "user",
							Message: "User not found",
							Code:    "USER_NOT_FOUND",
						},
					},
				},
			}
		}
		return nil, ps.dbErrorHandler.HandleError(err, "User lookup")
	}

	postID := uuid.New().String()
	post := models.Post{
		ID:           postID,
		Title:        req.Title,
		Content:      req.Content,
		Category:     req.Category,
		Images:       datatypes.JSON([]byte("[]")),
		LikeCount:    0,
		CommentCount: 0,
		ShareCount:   0,
		Updated:      false,
		UserID:       userID,
	}

	post.SetImages(req.Images)

	// Insert post
	if err := ps.db.Create(&post).Error; err != nil {
		return nil, ps.dbErrorHandler.HandleError(err, "Post creation")
	}

	return helpers.MapToPostResponse(post), nil
}

// UpdatePost - Update existing post with token verification
func (ps *PostService) UpdatePost(req models.UpdatePostRequest, tokenString string) (*models.PostResponse, error) {
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	// Find post and check ownership
	var post models.Post
	if err := ps.db.Where("id = ? AND user_id = ?", req.ID, userID).First(&post).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &helpers.AppError{
				Code:    fiber.StatusNotFound,
				Message: "Post not found or you don't have permission to update this post",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Post not found or you don't have permission to update this post",
					Errors: []helpers.FieldError{
						{
							Field:   "post",
							Message: "Post not found or you don't have permission to update this post",
							Code:    "POST_NOT_FOUND_OR_UNAUTHORIZED",
						},
					},
				},
			}
		}
		return nil, ps.dbErrorHandler.HandleError(err, "Post lookup")
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
		return nil, ps.dbErrorHandler.HandleError(err, "Post update")
	}

	// Prepare response
	return helpers.MapToPostResponse(post), nil
}

// DeletePost - Delete post with token verification
func (ps *PostService) DeletePost(id string, tokenString string) error {
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
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Post not found or you don't have permission to delete this post",
					Errors: []helpers.FieldError{
						{
							Field:   "post",
							Message: "Post not found or you don't have permission to delete this post",
							Code:    "POST_NOT_FOUND_OR_UNAUTHORIZED",
						},
					},
				},
			}
		}
		return ps.dbErrorHandler.HandleError(err, "Post lookup")
	}

	// Start transaction
	tx := ps.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Delete all comments associated with the post
	if err := tx.Where("post_id = ?", id).Unscoped().Delete(&models.Comment{}).Error; err != nil {
		tx.Rollback()
		return ps.dbErrorHandler.HandleTransactionError(err, "Comments deletion")
	}

	// Delete all likes associated with the post
	if err := tx.Where("post_id = ?", id).Unscoped().Delete(&models.PostLike{}).Error; err != nil {
		tx.Rollback()
		return ps.dbErrorHandler.HandleTransactionError(err, "Likes deletion")
	}

	// Delete the post
	if err := tx.Unscoped().Delete(&post).Error; err != nil {
		tx.Rollback()
		return ps.dbErrorHandler.HandleTransactionError(err, "Post deletion")
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return ps.dbErrorHandler.HandleTransactionError(err, "Transaction commit")
	}

	return nil
}

// GetPostByID - Get post by ID with author and comments
func (ps *PostService) GetPostByID(id string) (*models.PostResponse, error) {
	var post models.Post
	if err := ps.db.Preload("Author").
		Preload("Comments").
		Preload("Comments.Author").
		Preload("Likes").
		Preload("Likes.Author").
		Where("id = ?", id).First(&post).Error; err != nil {
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
		return nil, ps.dbErrorHandler.HandleError(err, "Post retrieval")
	}
	return helpers.MapToPostResponse(post), nil
}

// GetAllPosts - Get all posts with authors and comments
func (ps *PostService) GetAllPosts() ([]models.PostResponse, error) {
	var posts []models.Post
	if err := ps.db.Preload("Author").
		Preload("Comments").
		Preload("Comments.Author").
		Preload("Likes").
		Preload("Likes.Author").
		Find(&posts).Error; err != nil {
		return nil, ps.dbErrorHandler.HandleError(err, "Posts retrieval")
	}
	responses := make([]models.PostResponse, len(posts))
	for i, post := range posts {
		responses[i] = *helpers.MapToPostResponse(post)
	}
	return responses, nil
}

func (ps *PostService) ToggleLike(postID string, tokenString string) (*models.PostResponse, error) {
	userID, err := ps.us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	var post models.Post
	if err := ps.db.Where("id = ?", postID).First(&post).Error; err != nil {
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
		return nil, ps.dbErrorHandler.HandleError(err, "Post lookup")
	}

	var existingLike models.PostLike
	err = ps.db.Where("post_id = ? AND user_id = ?", postID, userID).First(&existingLike).Error

	if err == nil {
		if err := ps.db.Unscoped().Delete(&existingLike).Error; err != nil {
			return nil, ps.dbErrorHandler.HandleError(err, "Unlike operation")
		}

		post.LikeCount--
	} else if err == gorm.ErrRecordNotFound {
		newLike := models.PostLike{
			PostID: postID,
			UserID: userID,
		}

		if err := ps.db.Create(&newLike).Error; err != nil {
			return nil, ps.dbErrorHandler.HandleError(err, "Like operation")
		}

		post.LikeCount++
	} else {
		return nil, ps.dbErrorHandler.HandleError(err, "Like check")
	}

	if err := ps.db.Save(&post).Error; err != nil {
		return nil, ps.dbErrorHandler.HandleError(err, "Post update")
	}

	return helpers.MapToPostResponse(post), nil
}
