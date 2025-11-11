package models

import (
	"encoding/json"
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// ==================== POST MODEL ====================
type Post struct {
	gorm.Model
	ID           string         `gorm:"type:string;primaryKey;column:id"`
	Title        string         `gorm:"column:title;type:varchar(100);not null"`
	Content      string         `gorm:"column:content;type:text;not null"`
	Category     string         `gorm:"column:category;type:varchar(50)"`
	Images       datatypes.JSON `gorm:"column:images;type:jsonb"`
	LikeCount    uint64         `gorm:"column:like_count;default:0"`
	CommentCount uint64         `gorm:"column:comment_count;default:0"`
	ShareCount   uint64         `gorm:"column:share_count;default:0"`
	Updated      bool           `gorm:"column:updated;default:false"`
	CreatedAt    time.Time      `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt    time.Time      `gorm:"column:updated_at;autoUpdateTime"`

	// Relations
	UserID   string     `gorm:"type:string;not null;index;column:user_id"`
	Author   User       `gorm:"foreignKey:user_id;references:id;constraint:OnDelete:CASCADE"`
	Comments []Comment  `gorm:"foreignKey:post_id;references:id;constraint:OnDelete:CASCADE"`
	Likes    []PostLike `gorm:"foreignKey:post_id;references:id;constraint:OnDelete:CASCADE"`
}

func (Post) TableName() string {
	return "posts"
}

// ==================== REQUEST DTO ====================
type CreatePostRequest struct {
	Title    string   `json:"title" validate:"required,min=2,max=100"`
	Content  string   `json:"content" validate:"required,min=2"`
	Category string   `json:"category" validate:"required,min=1,max=50"`
	Images   []string `json:"images" validate:"max=4,required,omitempty"`
}

type UpdatePostRequest struct {
	ID      string `json:"id" validate:"required"`
	Title   string `json:"title" validate:"omitempty,min=2,max=100"`
	Content string `json:"content" validate:"omitempty,min=1"`
	Updated bool   `json:"updated" validate:"omitempty"`
}

// ==================== RESPONSE DTO ====================
type PostResponse struct {
	ID           string             `json:"id"`
	Title        string             `json:"title"`
	Content      string             `json:"content"`
	Category     string             `json:"category"`
	Images       []string           `json:"images"`
	LikeCount    uint64             `json:"like_count"`
	CommentCount uint64             `json:"comment_count"`
	ShareCount   uint64             `json:"share_count"`
	Updated      bool               `json:"updated"`
	CreatedAt    time.Time          `json:"created_at"`
	UpdatedAt    time.Time          `json:"updated_at"`
	Author       AuthorResponse     `json:"author"`
	Comments     []CommentResponse  `json:"comments"`
	Likes        []PostLikeResponse `json:"likes"`
}

type AuthorResponse struct {
	ID            string `json:"id"`
	Username      string `json:"username"`
	Avatar        string `json:"avatar"`
	WalletAddress string `json:"wallet_address"`
}

func (p *Post) GetImages() []string {
	var images []string
	if p.Images != nil {
		_ = json.Unmarshal(p.Images, &images)
	}
	return images
}

func (p *Post) SetImages(images []string) {
	data, _ := json.Marshal(images)
	p.Images = datatypes.JSON(data)
}
