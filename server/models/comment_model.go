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
	Content string `json:"content" validate:"required,min=10"`
	Image   string `json:"image" validate:"omitempty,max=255"`
	PostID  string `json:"post_id" validate:"required"`
}

type UpdateCommentRequest struct {
	ID      uint64 `json:"id" validate:"required,numeric,min=1"`
	Content string `json:"content" validate:"required,min=10"`
	Updated bool   `json:"updated"`
}

// ==================== RESPONSE DTO ====================
type CommentResponse struct {
	ID        uint64         `json:"id"`
	Author    AuthorResponse `json:"author"`
	Content   string         `json:"content"`
	Image     string         `json:"image"`
	Updated   bool           `json:"updated"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}
