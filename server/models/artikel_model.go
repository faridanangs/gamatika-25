package models

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Artikel struct {
	gorm.Model
	ID        string         `gorm:"column:id;type:string;primaryKey"`
	Title     string         `gorm:"column:title;type:varchar(300);not null"`
	Category  string         `gorm:"column:category;type:varchar(30);not null"`
	Tags      datatypes.JSON `gorm:"column:tags;type:jsonb;not null"`
	Content   string         `gorm:"column:content;type:text;not null"`
	Author    User           `gorm:"foreignKey:user_id;references:id;constraint:OnDelete:CASCADE"`
	CreatedAt time.Time      `gorm:"column:created_at;autoCreateTime"`

	UserID string `gorm:"column:user_id;type:string;not null"`
}

func (Artikel) TableName() string {
	return "artikels"
}

type ArtikelRequest struct {
	Title    string   `json:"title" validate:"required,min=4,max=300"`
	Category string   `json:"category" validate:"required,max=30"`
	Tags     []string `json:"tags" validate:"required"`
	Content  string   `json:"content" validate:"required,min=6"`
}

type ArtikelResponse struct {
	ID        string         `json:"id"`
	Title     string         `json:"title"`
	Category  string         `json:"category"`
	Tags      []string       `json:"tags"`
	Content   string         `json:"content"`
	Author    AuthorResponse `json:"author"`
	CreatedAt time.Time      `json:"created_at"`
}
