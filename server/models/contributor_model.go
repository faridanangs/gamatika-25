package models

import "time"

type Contribution struct {
	UserID         string    `json:"user_id"`
	Username       string    `json:"username"`
	TotalScore     uint64    `json:"total_score"`
	PostsCount     uint64    `json:"posts_count"`
	CommentsCount  uint64    `json:"comments_count"`
	ArtikelsCount  uint64    `json:"artikels_count"`
	LikesReceived  uint64    `json:"likes_received"`
	SharesReceived uint64    `json:"shares_received"`
	LastUpdated    time.Time `json:"last_updated"`
}

type TopContributorsResponse struct {
	Rank      uint64                `json:"rank"`
	User      AuthorResponse        `json:"user"`
	Score     uint64                `json:"score"`
	Breakdown ContributionBreakdown `json:"breakdown"`
}

type ContributionBreakdown struct {
	Posts    uint64 `json:"posts"`
	Artikels uint64 `json:"artikels"`
	Comments uint64 `json:"comments"`
	Likes    uint64 `json:"likes"`
	Shares   uint64 `json:"shares"`
}
