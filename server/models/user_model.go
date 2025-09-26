package models

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// ==================== USER MODEL ====================
type User struct {
	gorm.Model
	ID            string    `gorm:"type:string;primaryKey;column:id"`
	FullName      string    `gorm:"column:full_name;not null;type:varchar(100)"`
	Username      string    `gorm:"uniqueIndex;column:username;not null;type:varchar(20)"`
	Avatar        string    `gorm:"column:avatar;type:varchar(500);not null"`
	Prodi         string    `gorm:"column:prodi;type:varchar(50);not null"`
	Nim           string    `gorm:"column:nim;not null;uniqueIndex;type:varchar(30)"`
	Email         string    `gorm:"uniqueIndex;column:email;type:varchar(150)"`
	Password      string    `gorm:"column:password;type:string;not null"`
	WalletAddress string    `gorm:"column:wallet_address;type:varchar(200);not null"`
	PrivateKey    string    `gorm:"column:private_key;type:varchar(500);not null"`
	CreatedAt     time.Time `gorm:"column:created_at;autoCreateTime"`

	Achievements datatypes.JSON `gorm:"column:achievements;types:jsonb"`
	Posts        []Post         `gorm:"foreignKey:user_id;references:id"`
}

func (User) TableName() string {
	return "users"
}

// ==================== REQUEST DTO ====================
type CreateUserRequest struct {
	FullName      string `json:"full_name" validate:"required,min=3,max=100"`
	Username      string `json:"username" validate:"required,alphanum,min=5,max=20"`
	Avatar        string `json:"avatar" validate:"omitempty,url"`
	Prodi         string `json:"prodi" validate:"required,min=2,max=50"`
	Nim           string `json:"nim" validate:"alphanum,required,min=6,max=20"`
	Email         string `json:"email" validate:"required,email"`
	Password      string `json:"password" validate:"required,min=8,max=30"`
	WalletAddress string `json:"wallet_address" validate:"required"`
	PrivateKey    string `json:"private_key" validate:"required"`
}

type UpdateUserRequest struct {
	ID           string   `json:"id" validate:"required,uuid"`
	Username     string   `json:"username" validate:"omitempty,alphanum,min=5,max=20"`
	Achievements []string `json:"achievements" validate:"omitempty,max=50"`
	Avatar       string   `json:"avatar" validate:"omitempty,url"`
	Email        string   `json:"email" validate:"omitempty,email"`
	Password     string   `json:"password" validate:"omitempty,min=8,max=30"`
}

type PrivKeyReq struct {
	Password string `json:"password" validate:"required,min=6"`
}

// ==================== RESPONSE DTO ====================
type UserResponse struct {
	ID            string         `json:"id"`
	FullName      string         `json:"full_name"`
	Username      string         `json:"username"`
	Avatar        string         `json:"avatar"`
	Prodi         string         `json:"prodi"`
	Nim           string         `json:"nim"`
	Email         string         `json:"email"`
	WalletAddress string         `json:"wallet_address"`
	Achievements  datatypes.JSON `json:"achievements"`
	CreatedAt     time.Time      `json:"created_at"`
	Posts         []PostResponse `json:"posts"`
}
