package models

import (
	"time"

	"gorm.io/gorm"
)

// ==================== USER MODEL ====================
type User struct {
	gorm.Model
	ID         string    `gorm:"type:string;primaryKey;column:id"`
	FullName   string    `gorm:"column:full_name;not null;type:varchar(150)"`
	Username   string    `gorm:"uniqueIndex;column:username;not null;type:varchar(50)"`
	Avatar     string    `gorm:"column:avatar;type:varchar(250);not null"`
	Prodi      string    `gorm:"column:prodi;type:varchar(50);not null"`
	Nim        uint64    `gorm:"column:nim;not null;uniqueIndex"`
	Email      string    `gorm:"uniqueIndex;column:email;type:varchar(150)"`
	Password   string    `gorm:"column:password;type:string;not null"`
	PublicKey  string    `gorm:"column:public_key;type:varchar(512);not null"`
	PrivateKey string    `gorm:"column:private_key;type:string;not null"`
	CreatedAt  time.Time `gorm:"column:created_at;autoCreateTime"`

	Posts []Post `gorm:"foreignKey:user_id;references:id"`
}

func (User) TableName() string {
	return "users"
}

// ==================== REQUEST DTO ====================
type CreateUserRequest struct {
	FullName   string `json:"full_name" validate:"required"`
	Username   string `json:"username" validate:"required"`
	Avatar     string `json:"avatar"`
	Prodi      string `json:"prodi" validate:"required"`
	Nim        uint64 `json:"nim" validate:"required,numeric"`
	Email      string `json:"email" validate:"required,email"`
	Password   string `json:"password" validate:"required,min=6"`
	PublicKey  string `json:"public_key"`
	PrivateKey string `json:"private_key"`
}

type UpdateUserRequest struct {
	ID       string `json:"id" validate:"required"`
	Username string `json:"username" validate:"omitempty"`
	Email    string `json:"email" validate:"omitempty,email"`
	Password string `json:"password" validate:"omitempty,min=6"`
}

// ==================== RESPONSE DTO ====================
type UserResponse struct {
	ID        string         `json:"id"`
	FullName  string         `json:"full_name"`
	Username  string         `json:"username"`
	Avatar    string         `json:"avatar"`
	Prodi     string         `json:"prodi"`
	Nim       uint64         `json:"nim"`
	Email     string         `json:"email"`
	PublicKey string         `json:"public_key"`
	CreatedAt time.Time      `json:"created_at"`
	Posts     []PostResponse `json:"posts"`
}
