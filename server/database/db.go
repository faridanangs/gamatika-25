package database

import (
	"fmt"
	"log"
	"os"

	"github.com/faridanangs/gamatika-25/models"
	"github.com/joho/godotenv"
	"github.com/josestg/getenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() *gorm.DB {
	host := getenv.String("HOST", "localhost")
	port := getenv.String("PORT", "5432")
	user := getenv.String("USER", "postgres")
	password := getenv.String("PASSWORD", "postgres")
	dbname := getenv.String("DBNAME", "postgres")

	appEnv := os.Getenv("APP_ENV")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host, user, password, dbname, port)

	if appEnv == "production" {
		if err := godotenv.Load(".env.local"); err != nil {
			log.Println("Peringatan: Tidak dapat memuat file .env")
		}

		dsn = os.Getenv("NEON_DB_URL")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	if err := db.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.PostLike{}, &models.Artikel{}); err != nil {
		log.Fatal("Failed to migrate database schema: ", err)
	}

	return db
}
