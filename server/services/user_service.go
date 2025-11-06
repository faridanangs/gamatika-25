package services

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/faridanangs/gamatika-25/middleware"
	"github.com/faridanangs/gamatika-25/models"
	"github.com/faridanangs/gamatika-25/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/josestg/getenv"
	"gorm.io/gorm"
)

type UserService struct {
	db                 *gorm.DB
	val                *validator.Validate
	mu                 sync.RWMutex
	cachedContributors []models.TopContributorsResponse
	dbErrorHandler     *helpers.DatabaseErrorHandler
}

func NewUserService(db *gorm.DB, val *validator.Validate) *UserService {
	us := &UserService{
		db:                 db,
		val:                val,
		cachedContributors: make([]models.TopContributorsResponse, 0),
		dbErrorHandler:     helpers.NewDatabaseErrorHandler(),
	}

	us.updateCache()

	us.StartTopContributorScheduler()

	return us

}

// CreateUser - Create new user with validation
func (us *UserService) CreateUser(req models.CreateUserRequest) (*models.UserResponse, error) {

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to process password",
		}
	}

	encryptedPrivateKey, err := utils.EncryptPrivateKeyWithPassword(req.PrivateKey, req.Password)
	if err != nil {
		return nil, &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to encrypt private key",
		}
	}

	req.Avatar = getenv.String("AVATAR", "https://res.cloudinary.com/detetmaw8/image/upload/v1758013653/forum-comments/xzfg7jskt08evwbdh0n5.png")

	user := models.User{
		ID:            uuid.NewString(),
		FullName:      req.FullName,
		Username:      req.Username,
		Role:          req.Role,
		Avatar:        req.Avatar,
		Prodi:         req.Prodi,
		Nim:           req.Nim,
		Email:         req.Email,
		Password:      hashedPassword,
		WalletAddress: req.WalletAddress,
		PrivateKey:    encryptedPrivateKey,
	}

	if err := us.db.Create(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User creation")
	}

	return helpers.MapToUserResponse(user), nil
}

// UpdateUser - Update existing user with ownership check
func (us *UserService) UpdateUser(req models.UpdateUserRequest, tokenString string) (*models.UserResponse, error) {
	userID, err := us.ValidateUserToken(tokenString)
	if err != nil {
		return nil, err
	}

	if req.ID != userID {
		return nil, &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only update your own account",
		}
	}

	var user models.User
	if err := us.db.Where("id = ?", req.ID).First(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User lookup")
	}

	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Password != "" {
		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			return nil, &helpers.AppError{
				Code:    fiber.StatusInternalServerError,
				Message: "Failed to process password",
			}
		}
		user.Password = hashedPassword
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}

	if len(req.Achievements) != 0 {
		var existingAchievements []string
		if user.Achievements != nil {
			if err := json.Unmarshal(user.Achievements, &existingAchievements); err != nil {
				return nil, us.dbErrorHandler.HandleError(err, "Unmarshal existing achievements")
			}
		}

		newAchievements := append(existingAchievements, req.Achievements...)

		updatedData, err := json.Marshal(newAchievements)

		if err != nil {
			return nil, us.dbErrorHandler.HandleError(err, "Marshal updated achievements")
		}

		if err := us.db.Model(&user).Update("achievements", updatedData).Error; err != nil {
			return nil, us.dbErrorHandler.HandleError(err, "Update Achievements")
		}
	}

	if err := us.db.Save(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User update")
	}

	return helpers.MapToUserResponse(user), nil
}

// DeleteUser - Delete user with ownership check
func (us *UserService) DeleteUser(id string, tokenString string) error {

	claims, err := middleware.ValidateJWT(tokenString)
	if err != nil {
		return &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	if id != claims.UserID && claims.Role != "admin" {
		return &helpers.AppError{
			Code:    fiber.StatusForbidden,
			Message: "You can only delete your own account",
		}
	}

	if err := us.db.Where("id = ?", id).Unscoped().Delete(&models.User{}).Error; err != nil {
		return us.dbErrorHandler.HandleTransactionError(err, "User deletion")
	}

	return nil
}

// GetUserByID - Get user by ID
func (us *UserService) GetUserByID(query string) (*models.UserResponse, error) {
	var user models.User
	if err := us.db.Where("id = ? or email = ? or username = ?", query, query, query).First(&user).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "User retrieval")
	}

	return helpers.MapToUserResponse(user), nil
}

func (us *UserService) GetUserPost(id string, page, limit int) ([]models.PostResponse, int64, error) {
	offset := (page - 1) * limit
	var count int64
	var posts []models.Post

	tx := us.db.Model(&models.Post{}).Where("user_id = ?", id)

	if err := tx.Count(&count).Error; err != nil {
		return nil, 0, us.dbErrorHandler.HandleError(err, "Count User Post Error")
	}

	if err := tx.Preload("Author").
		Offset(offset).
		Limit(limit).
		Order("created_at desc").
		Find(&posts).Error; err != nil {
		return nil, 0, us.dbErrorHandler.HandleError(err, "Get User Post Error")
	}

	responses := make([]models.PostResponse, len(posts))
	for i, post := range posts {
		responses[i] = *helpers.MapToPostResponse(post)
	}

	return responses, count, nil
}

func (us *UserService) GetUserArtikel(id string, page, limit int) ([]models.ArtikelResponse, int64, error) {
	offset := (page - 1) * limit
	var count int64
	var artikels []models.Artikel

	tx := us.db.Model(&models.Artikel{}).Where("user_id = ?", id)

	if err := tx.Count(&count).Error; err != nil {
		return nil, 0, us.dbErrorHandler.HandleError(err, "Count User Artikel Error")
	}

	if err := tx.Preload("Author").
		Offset(offset).
		Limit(limit).
		Find(&artikels).Error; err != nil {
		return nil, 0, us.dbErrorHandler.HandleError(err, "get user artikel error")
	}

	responses := make([]models.ArtikelResponse, len(artikels))
	for i, artikel := range artikels {
		responses[i] = *helpers.MapToArtikelResponse(artikel)
	}

	return responses, count, nil
}

// LoginUser - User authentication with JWT token
func (us *UserService) LoginUser(email, password string) (*models.UserResponse, string, error) {
	var user models.User
	if err := us.db.Where("username = ? OR email = ?", email, email).First(&user).Error; err != nil {
		return nil, "", us.dbErrorHandler.HandleError(err, "User authentication")
	}

	if !utils.CheckPassword(password, user.Password) {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid Password",
		}
	}

	token, err := middleware.GenerateJWT(user.ID, user.Username, user.Role)
	if err != nil {
		return nil, "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to generate authentication token",
		}
	}

	return helpers.MapToUserResponse(user), token, nil
}

// ValidateUserToken - Validate user token and check if user exists
func (us *UserService) ValidateUserToken(tokenString string) (string, error) {
	claims, err := middleware.ValidateJWT(tokenString)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid or expired token",
		}
	}

	var user models.User
	if err := us.db.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		return "", us.dbErrorHandler.HandleError(err, "Token validation")
	}

	return user.ID, nil
}

// GetPrivateKeyWithPassword - Get user's private key
func (us *UserService) GetPrivateKeyWithPassword(userID string, req models.PrivKeyReq) (string, error) {
	var user models.User
	if err := us.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return "", us.dbErrorHandler.HandleError(err, "User lookup")
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid password",
		}
	}

	privateKey, err := utils.DecryptPrivateKeyWithPassword(user.PrivateKey, req.Password)
	if err != nil {
		return "", &helpers.AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Failed to decrypt private key",
		}
	}

	return privateKey, nil
}

// func (us *UserService) CalculateUserContribution(userID string) (*models.Contribution, error) {
// 	var contribution models.Contribution
// 	var user models.User

// 	if err := us.db.Preload("Posts").Where("id = ?", userID).First(&user).Error; err != nil {
// 		return nil, us.dbErrorHandler.HandleError(err, "User contribution calculation")
// 	}

// 	sevenDaysAgo := time.Now().AddDate(0, 0, -7)

// 	var postsCount, commentsCount, artikelsCount, likesReceived, sharesReceived uint64

// 	for _, post := range user.Posts {
// 		if post.CreatedAt.After(sevenDaysAgo) {
// 			postsCount++
// 			likesReceived += post.LikeCount
// 			sharesReceived += post.ShareCount
// 		}
// 	}

// 	var comments []models.Comment
// 	if err := us.db.Where("user_id = ?", userID).Find(&comments).Error; err != nil {
// 		return nil, us.dbErrorHandler.HandleError(err, "Comments retrieval")
// 	}

// 	for _, comment := range comments {
// 		if comment.CreatedAt.After(sevenDaysAgo) {
// 			commentsCount++
// 		}
// 	}

// 	var artikels []models.Artikel
// 	if err := us.db.Where("user_id = ?", userID).Find(&artikels).Error; err != nil {
// 		return nil, us.dbErrorHandler.HandleError(err, "Artikels retrieval")
// 	}

// 	for _, artikel := range artikels {
// 		if artikel.CreatedAt.After(sevenDaysAgo) {
// 			artikelsCount++
// 		}
// 	}

// 	totalScore := (postsCount * 2) + (commentsCount * 3) + (likesReceived * 2) + (sharesReceived * 2) + (artikelsCount * 5)

// 	contribution = models.Contribution{
// 		UserID:         user.ID,
// 		Username:       user.Username,
// 		TotalScore:     totalScore,
// 		PostsCount:     postsCount,
// 		CommentsCount:  commentsCount,
// 		ArtikelsCount:  artikelsCount,
// 		LikesReceived:  likesReceived,
// 		SharesReceived: sharesReceived,
// 		LastUpdated:    time.Now(),
// 	}

// 	return &contribution, nil
// }

// Ini diperbaiki di bagian get all user, karna kita hanya perlu user dengan aktifitas 7 hari terakhir
// GetTopContributors - Get top contributors
// GetTopContributors - Get top contributors using a single optimized SQL query
func (us *UserService) GetTopContributors() ([]models.TopContributorsResponse, error) {
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	var results []models.ContributionQueryResult // Gunakan struct helper

	// Query SQL ini menggunakan CTE untuk mengagregasi data sebelum menggabungkannya.
	// Ini jauh lebih efisien daripada ribuan query kecil.
	// Catatan: Pastikan nama tabel (posts, comments, artikels) dan kolom (like_count, share_count) sesuai
	sqlQuery := `
        WITH 
        user_posts AS (
          SELECT
            user_id,
            COUNT(*) AS posts_count,
            COALESCE(SUM(like_count), 0) AS likes_received,
            COALESCE(SUM(share_count), 0) AS shares_received
          FROM posts
          WHERE created_at >= ?
          GROUP BY user_id
        ),
        user_comments AS (
          SELECT
            user_id,
            COUNT(*) AS comments_count
          FROM comments
          WHERE created_at >= ?
          GROUP BY user_id
        ),
        user_artikels AS (
          SELECT
            user_id,
            COUNT(*) AS artikels_count
          FROM artikels
          WHERE created_at >= ?
          GROUP BY user_id
        ),
        -- Gabungkan semua ID user yang aktif dalam 7 hari terakhir
        all_active_users AS (
          SELECT user_id FROM user_posts
          UNION
          SELECT user_id FROM user_comments
          UNION
          SELECT user_id FROM user_artikels
        )
        -- Hitung skor total dan ambil data user
        SELECT
          u.id AS user_id,
          u.username,
          u.avatar,
          u.wallet_address,
          COALESCE(p.posts_count, 0) AS posts_count,
          COALESCE(c.comments_count, 0) AS comments_count,
          COALESCE(a.artikels_count, 0) AS artikels_count,
          COALESCE(p.likes_received, 0) AS likes_received,
          COALESCE(p.shares_received, 0) AS shares_received,
          (
            (COALESCE(p.posts_count, 0) * 2) +
            (COALESCE(c.comments_count, 0) * 3) +
            (COALESCE(p.likes_received, 0) * 2) +
            (COALESCE(p.shares_received, 0) * 2) +
            (COALESCE(a.artikels_count, 0) * 5)
          ) AS total_score
        FROM all_active_users au
        JOIN users u ON u.id = au.user_id
        LEFT JOIN user_posts p ON p.user_id = au.user_id
        LEFT JOIN user_comments c ON c.user_id = au.user_id
        LEFT JOIN user_artikels a ON a.user_id = au.user_id
        ORDER BY total_score DESC
        LIMIT 3
    `

	// Jalankan query mentah
	// Kita passing sevenDaysAgo 3x untuk mengisi 3 placeholder (?) di query
	if err := us.db.Raw(sqlQuery, sevenDaysAgo, sevenDaysAgo, sevenDaysAgo).Scan(&results).Error; err != nil {
		return nil, us.dbErrorHandler.HandleError(err, "Top contributors retrieval")
	}

	// Ubah hasil query menjadi format response yang Anda inginkan
	var topContributors []models.TopContributorsResponse
	for i, res := range results {
		topContributors = append(topContributors, models.TopContributorsResponse{
			Rank: uint64(i + 1),
			User: models.AuthorResponse{
				ID:            res.UserID,
				Username:      res.Username,
				Avatar:        res.Avatar,
				WalletAddress: res.WalletAddress,
			},
			Score: res.TotalScore,
			Breakdown: models.ContributionBreakdown{
				Posts:    res.PostsCount,
				Artikels: res.ArtikelsCount,
				Comments: res.CommentsCount,
				Likes:    res.LikesReceived,
				Shares:   res.SharesReceived,
			},
		})
	}

	return topContributors, nil
}

func (us *UserService) StartTopContributorScheduler() {
	us.updateCache()
	ticker := time.NewTicker(7 * 24 * time.Hour)

	go func() {
		for range ticker.C {
			us.updateCache()
		}
	}()
}

func (us *UserService) updateCache() {
	contributors, err := us.GetTopContributors()
	if err != nil {
		return
	}

	if len(contributors) == 0 {
		return
	}

	us.mu.Lock()
	us.cachedContributors = contributors
	us.mu.Unlock()

}

// GetCachedTopContributors - Get cached top contributors
func (us *UserService) GetCachedTopContributors() []models.TopContributorsResponse {
	us.mu.RLock()
	defer us.mu.RUnlock()
	return us.cachedContributors
}
