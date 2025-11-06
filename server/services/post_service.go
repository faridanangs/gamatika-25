package services

import (
	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/middleware"
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

	if err := ps.db.Create(&post).Error; err != nil {
		return nil, ps.dbErrorHandler.HandleError(err, "Post creation")
	}

	resp, err := ps.GetPostByID(postID)
	if err != nil {
		return nil, err
	}

	return resp, nil
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
	claims, err := middleware.ValidateJWT(tokenString)
	if err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	// Find post and check ownership
	var post models.Post
	if err := ps.db.Preload("Author").Where("id = ?", id).First(&post).Error; err != nil {
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

	if post.Author.ID != claims.UserID && claims.Role != "admin" {
		return &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only delete your own post",
		}
	}

	if err := ps.db.Unscoped().Where("id = ?", id).Delete(&post).Error; err != nil {
		return ps.dbErrorHandler.HandleTransactionError(err, "Post deletion")
	}

	return nil
}

// GetPostByID - Get post by ID with author and comments
func (ps *PostService) GetPostByID(id string) (*models.PostResponse, error) {
	var post models.Post
	if err := ps.db.Preload("Author").Where("id = ?", id).First(&post).Error; err != nil {
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
		return nil, ps.dbErrorHandler.HandleError(err, "Get Post Error")
	}
	return helpers.MapToPostResponse(post), nil
}

func (ps *PostService) GetPostPerPage(page, limit int, category, q string) ([]models.PostResponse, error) {
	var posts []models.Post

	if page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	query := ps.db.Model(&models.Post{})

	if category != "" && category != "Semua" {
		query = query.Where("category = ?", category)
	}

	if q != "" {
		searchQuery := "%" + q + "%"
		query = query.Where("title ILIKE ? OR content ILIKE ?", searchQuery, searchQuery)
	}

	if err := query.Preload("Author").
		Limit(limit).
		Offset(offset).
		Order("created_at desc").Find(&posts).Error; err != nil {
		return nil, ps.dbErrorHandler.HandleError(err, "Get Posts Per Page Error")
	}

	responses := make([]models.PostResponse, len(posts))
	for i, post := range posts {
		responses[i] = *helpers.MapToPostResponse(post)
	}
	return responses, nil
}

func (ps *PostService) GetPostCommentPerPage(id string, page, limit int) ([]models.CommentResponse, int64, error) {
	var comments []models.Comment
	var count int64

	offset := (page - 1) * limit

	query := ps.db.Model(&models.Comment{}).Where("post_id = ?", id)

	if err := query.Count(&count).Error; err != nil {
		return nil, 0, ps.dbErrorHandler.HandleError(err, "Get Posts Comment Count Per Page Error")
	}

	if err := query.Preload("Author").Offset(offset).Limit(limit).Find(&comments).Error; err != nil {
		return nil, 0, ps.dbErrorHandler.HandleError(err, "Get Posts Comment Per Page Error")
	}

	responses := make([]models.CommentResponse, len(comments))
	for i, comment := range comments {
		responses[i] = *helpers.MapToCommentResponse(comment)
	}

	return responses, count, nil

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
