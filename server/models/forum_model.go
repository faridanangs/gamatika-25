package models

import "time"

///// Comment Model

type Comment struct {
	ID        uint64
	Author    User
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
	Updated   bool
	Image     string
	PostID    string
	UserID    string
}

type CreateCommentRequest struct {
	Content string
	Image   string
	PostID  string
	UserID  string
}

type UpdateCommentRequest struct {
	ID      uint64
	Content string
	Updated bool
}

type CommentResponse struct {
	ID        uint64
	Author    User
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
	Updated   bool
	Image     string
}

///// Post Model

type Post struct {
	ID           string
	Title        string
	Content      string
	Category     string
	Author       User
	LikeCount    uint64
	CommentCount uint64
	ShareCount   uint64
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Updated      bool
	UserID       string
	Image        string
	Comments     []Comment
}

type CreatePostRequest struct {
	Title     string
	Content   string
	Category  string
	CreatedAt time.Time
	UserID    string
	Image     string
}

type UpdatePostRequest struct {
	ID      string
	Title   string
	Content string
	Updated bool
}

type PostResponse struct {
	ID           string
	Title        string
	Content      string
	Category     string
	Author       User
	LikeCount    uint64
	CommentCount uint64
	ShareCount   uint64
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Updated      bool
	Image        string
	Comments     []Comment
}
