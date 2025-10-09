package database

import (
	"fmt"
	"log"

	"github.com/faridanangs/gamatika-25/models"
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

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	if err := db.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.PostLike{}); err != nil {
		log.Fatal("Failed to migrate database schema: ", err)
	}

	return db
}
