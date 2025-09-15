package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"io"

	"golang.org/x/crypto/bcrypt"
)

// Helper function to hash password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Helper function to check password
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// EncryptPrivateKeyWithPassword mengenkripsi private key menggunakan password
func EncryptPrivateKeyWithPassword(privateKey, password string) (string, error) {
	// Buat kunci dari password menggunakan SHA-256
	key := sha256.Sum256([]byte(password))

	// Buat blok AES
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	// Buat GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Buat nonce
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Enkripsi data
	encrypted := gcm.Seal(nonce, nonce, []byte(privateKey), nil)

	// Kembalikan sebagai base64
	return base64.StdEncoding.EncodeToString(encrypted), nil
}

// DecryptPrivateKeyWithPassword mendekripsi private key menggunakan password
func DecryptPrivateKeyWithPassword(encryptedPrivateKey, password string) (string, error) {
	// Decode dari base64
	encrypted, err := base64.StdEncoding.DecodeString(encryptedPrivateKey)
	if err != nil {
		return "", err
	}

	// Buat kunci dari password menggunakan SHA-256
	key := sha256.Sum256([]byte(password))

	// Buat blok AES
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	// Buat GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Pisahkan nonce dan ciphertext
	nonceSize := gcm.NonceSize()
	if len(encrypted) < nonceSize {
		return "", errors.New("encrypted text too short")
	}

	nonce, ciphertext := encrypted[:nonceSize], encrypted[nonceSize:]

	// Dekripsi data
	decrypted, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(decrypted), nil
}
