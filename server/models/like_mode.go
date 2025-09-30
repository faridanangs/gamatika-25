package models

import (
	"time"

	"gorm.io/gorm"
)

type PostLike struct {
	gorm.Model
	ID      int       `gorm:"primaryKey;autoIncerement;column:id"`
	PostID  string    `gorm:"type:string;not null;index;column:post_id"`
	UserID  string    `gorm:"type:string;not null;index;column:user_id"`
	LikedAt time.Time `gorm:"column:liked_at;autoCreateTime"`

	Author User `gorm:"foreignKey:user_id;references:id;constraint:OnDelete:CASCADE"`
}

func (PostLike) TableName() string {
	return "post_likes"
}

type PostLikeResponse struct {
	ID      int            `json:"id"`
	LikedAt time.Time      `json:"liked_at"`
	Author  AuthorResponse `json:"author"`
}
