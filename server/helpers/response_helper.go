package helpers

import "github.com/faridanangs/gamatika-25/models"

// Helper function to map User to AuthorResponse
func MapToAuthorResponse(user models.User) models.AuthorResponse {
	return models.AuthorResponse{
		ID:       user.ID,
		Username: user.Username,
		Avatar:   user.Avatar,
	}
}

// Helper function to map Post to PostResponse
func MapToPostResponse(post models.Post) *models.PostResponse {
	commentResponses := make([]models.CommentResponse, len(post.Comments))
	for i, comment := range post.Comments {
		commentResponses[i] = *MapToCommentResponse(comment)
	}

	likeResponses := make([]models.PostLikeResponse, len(post.Likes))
	for i, like := range post.Likes {
		likeResponses[i] = *MapToLikeResponse(like)
	}

	images := post.GetImages()

	return &models.PostResponse{
		ID:           post.ID,
		Title:        post.Title,
		Content:      post.Content,
		Category:     post.Category,
		Images:       images,
		LikeCount:    post.LikeCount,
		CommentCount: post.CommentCount,
		ShareCount:   post.ShareCount,
		Updated:      post.Updated,
		CreatedAt:    post.CreatedAt,
		UpdatedAt:    post.UpdatedAt,
		Author:       MapToAuthorResponse(post.Author),
		Comments:     commentResponses,
		Likes:        likeResponses,
	}
}

// Helper function to map Comment to CommentResponse
func MapToCommentResponse(comment models.Comment) *models.CommentResponse {
	return &models.CommentResponse{
		ID:        comment.ID,
		Author:    MapToAuthorResponse(comment.Author),
		Content:   comment.Content,
		Image:     comment.Image,
		Updated:   comment.Updated,
		CreatedAt: comment.CreatedAt,
		UpdatedAt: comment.UpdatedAt,
	}
}
func MapToLikeResponse(like models.PostLike) *models.PostLikeResponse {
	return &models.PostLikeResponse{
		ID:      like.ID,
		LikedAt: like.LikedAt,
		Author:  MapToAuthorResponse(like.Author),
	}
}

func MapToUserResponse(user models.User) *models.UserResponse {
	postResponses := make([]models.PostResponse, len(user.Posts))
	for i, post := range user.Posts {
		postResponses[i] = *MapToPostResponse(post)
	}

	return &models.UserResponse{
		ID:            user.ID,
		FullName:      user.FullName,
		Username:      user.Username,
		Avatar:        user.Avatar,
		Prodi:         user.Prodi,
		Nim:           user.Nim,
		Email:         user.Email,
		WalletAddress: user.WalletAddress,
		Achievements:  user.Achievements,
		CreatedAt:     user.CreatedAt,
		Posts:         postResponses,
	}
}
