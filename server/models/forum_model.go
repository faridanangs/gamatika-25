package models

import (
	"time"

	"gorm.io/gorm"
)

// ==================== COMMENT MODEL ====================
type Comment struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey;autoIncrement;column:id"`
	Content   string    `gorm:"column:content;type:string;not null"`
	Image     string    `gorm:"column:image;type:varchar(255)"`
	Updated   bool      `gorm:"column:updated;default:false"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime"`

	// Relations
	PostID string `gorm:"type:string;not null;index;column:post_id"`
	UserID string `gorm:"type:string;not null;index;column:user_id"`

	Post   Post `gorm:"foreignKey:post_id;references:id"`
	Author User `gorm:"foreignKey:user_id;references:id"`
}

func (Comment) TableName() string {
	return "comments"
}

// ==================== REQUEST DTO ====================
type CreateCommentRequest struct {
	Content string `json:"content" validate:"required"`
	Image   string `json:"image"`
	PostID  string `json:"post_id" validate:"required"`
	UserID  string `json:"user_id" validate:"required"`
}

type UpdateCommentRequest struct {
	ID      uint64 `json:"id" validate:"required,numeric"`
	Content string `json:"content" validate:"omitempty"`
	Updated bool   `json:"updated"`
}

// ==================== RESPONSE DTO ====================
type CommentResponse struct {
	ID        uint64    `json:"id"`
	Author    User      `json:"author"`
	Content   string    `json:"content"`
	Image     string    `json:"image"`
	Updated   bool      `json:"updated"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ==================== POST MODEL ====================
type Post struct {
	gorm.Model
	ID           string    `gorm:"type:string;primaryKey;column:id"`
	Title        string    `gorm:"column:title;type:varchar(255);not null"`
	Content      string    `gorm:"column:content;type:text;not null"`
	Category     string    `gorm:"column:category;type:varchar(100)"`
	Image        string    `gorm:"column:image;type:varchar(255)"`
	LikeCount    uint64    `gorm:"column:like_count;default:0"`
	CommentCount uint64    `gorm:"column:comment_count;default:0"`
	ShareCount   uint64    `gorm:"column:share_count;default:0"`
	Updated      bool      `gorm:"column:updated;default:false"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime"`

	// Relations
	UserID string `gorm:"type:string;not null;index;column:user_id"`
	Author User   `gorm:"foreignKey:user_id;references:id"`

	Comments []Comment `gorm:"foreignKey:post_id;references:id"`
}

func (Post) TableName() string {
	return "posts"
}

// ==================== REQUEST DTO ====================
type CreatePostRequest struct {
	Title    string `json:"title" validate:"required"`
	Content  string `json:"content" validate:"required"`
	Category string `json:"category" validate:"required"`
	UserID   string `json:"user_id" validate:"required"`
	Image    string `json:"image"`
}

type UpdatePostRequest struct {
	ID      string `json:"id" validate:"required"`
	Title   string `json:"title" validate:"omitempty"`
	Content string `json:"content" validate:"omitempty"`
	Updated bool   `json:"updated"`
}

// ==================== RESPONSE DTO ====================
type PostResponse struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	Category     string    `json:"category"`
	Image        string    `json:"image"`
	LikeCount    uint64    `json:"like_count"`
	CommentCount uint64    `json:"comment_count"`
	ShareCount   uint64    `json:"share_count"`
	Updated      bool      `json:"updated"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Author       User      `json:"author"`
	Comments     []Comment `json:"comments"`
}
