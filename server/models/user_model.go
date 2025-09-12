package models

import "time"

type User struct {
	ID         string
	FullName   string
	Username   string
	Avatar     string
	Prodi      string
	Nim        uint32
	Email      string
	Password   string
	PublicKey  string
	PrivateKey string
	CreatedAt  time.Time
	Posts      []Post
}

type CreateUserRequest struct {
	FullName   string
	Username   string
	Avatar     string
	Prodi      string
	Nim        uint32
	Email      string
	Password   string
	PublicKey  string
	PrivateKey string
	CreatedAt  time.Time
}

type UpdateUserRequest struct {
	ID       string
	Username string
	Email    string
	Password string
}

type UserResponse struct {
	ID        string
	FullName  string
	Username  string
	Avatar    string
	Prodi     string
	Nim       uint32
	Email     string
	PublicKey string
	CreatedAt time.Time
	Posts     []Post
}
