package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dns := "host=localhost user=postgres dbname=gamatika port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	DB = db
}
