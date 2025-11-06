package models

type ContributionQueryResult struct {
	UserID         string
	Username       string
	Avatar         string
	WalletAddress  string
	PostsCount     uint64
	CommentsCount  uint64
	ArtikelsCount  uint64
	LikesReceived  uint64
	SharesReceived uint64
	TotalScore     uint64
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
