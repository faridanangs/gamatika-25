package middleware

import (
	"fmt"
	"strings"
	"time"

	"github.com/faridanangs/gamatika-25/helpers"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key-here")

type JWTClaims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Generate JWT token
func GenerateJWT(userID, username, role string) (string, error) {
	claims := JWTClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}
	return tokenString, nil
}

// Validate JWT token
func ValidateJWT(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (any, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		// Check for specific JWT errors
		if strings.Contains(err.Error(), "token is expired") {
			return nil, &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Token has expired",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Token has expired",
					Errors: []helpers.FieldError{
						{
							Field:   "token",
							Message: "Token has expired",
							Code:    "TOKEN_EXPIRED",
						},
					},
				},
			}
		}

		if strings.Contains(err.Error(), "token used before issued") {
			return nil, &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Token is not valid yet",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Token is not valid yet",
					Errors: []helpers.FieldError{
						{
							Field:   "token",
							Message: "Token is not valid yet",
							Code:    "TOKEN_NOT_VALID_YET",
						},
					},
				},
			}
		}

		if strings.Contains(err.Error(), "token contains an invalid number of segments") {
			return nil, &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Malformed token",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Malformed token",
					Errors: []helpers.FieldError{
						{
							Field:   "token",
							Message: "Malformed token",
							Code:    "TOKEN_MALFORMED",
						},
					},
				},
			}
		}

		if strings.Contains(err.Error(), "signature is invalid") {
			return nil, &helpers.AppError{
				Code:    fiber.StatusUnauthorized,
				Message: "Invalid token signature",
				Details: &helpers.CustomErrorResponse{
					Status:  "error",
					Message: "Invalid token signature",
					Errors: []helpers.FieldError{
						{
							Field:   "token",
							Message: "Invalid token signature",
							Code:    "TOKEN_SIGNATURE_INVALID",
						},
					},
				},
			}
		}

		// Handle other errors
		return nil, &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Failed to parse token",
			Details: &helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Failed to parse token",
				Errors: []helpers.FieldError{
					{
						Field:   "token",
						Message: "Failed to parse token",
						Code:    "TOKEN_PARSE_ERROR",
					},
				},
			},
		}
	}

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, &helpers.AppError{
		Code:    fiber.StatusUnauthorized,
		Message: "Invalid token claims",
		Details: &helpers.CustomErrorResponse{
			Status:  "error",
			Message: "Invalid token claims",
			Errors: []helpers.FieldError{
				{
					Field:   "token",
					Message: "Invalid token claims",
					Code:    "TOKEN_CLAIMS_INVALID",
				},
			},
		},
	}
}

// JWT Middleware for Fiber
func JWTProtected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(&helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Missing authorization header",
				Errors: []helpers.FieldError{
					{
						Field:   "authorization",
						Message: "Missing authorization header",
						Code:    "MISSING_AUTH_HEADER",
					},
				},
			})
		}

		// Extract token from Bearer token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return c.Status(fiber.StatusUnauthorized).JSON(&helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Invalid authorization format",
				Errors: []helpers.FieldError{
					{
						Field:   "authorization",
						Message: "Invalid authorization format. Use 'Bearer <token>'",
						Code:    "INVALID_AUTH_FORMAT",
					},
				},
			})
		}

		// Validate token
		claims, err := ValidateJWT(tokenString)
		if err != nil {
			// Check if it's an AppError with CustomErrorResponse
			if appErr, ok := err.(*helpers.AppError); ok {
				if customErr, ok := appErr.Details.(*helpers.CustomErrorResponse); ok {
					return c.Status(appErr.Code).JSON(customErr)
				}
			}

			// Fallback error response
			return c.Status(fiber.StatusUnauthorized).JSON(&helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Invalid or expired token",
				Errors: []helpers.FieldError{
					{
						Field:   "token",
						Message: "Invalid or expired token",
						Code:    "TOKEN_INVALID",
					},
				},
			})
		}

		// Store user info in context
		c.Locals("user_id", claims.UserID)
		c.Locals("username", claims.Username)

		return c.Next()
	}
}

// TokenString extracts the JWT token from the request
func TokenString(c *fiber.Ctx) (string, error) {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Missing authorization header",
			Details: &helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Missing authorization header",
				Errors: []helpers.FieldError{
					{
						Field:   "authorization",
						Message: "Missing authorization header",
						Code:    "MISSING_AUTH_HEADER",
					},
				},
			},
		}
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		return "", &helpers.AppError{
			Code:    fiber.StatusUnauthorized,
			Message: "Invalid authorization format",
			Details: &helpers.CustomErrorResponse{
				Status:  "error",
				Message: "Invalid authorization format",
				Errors: []helpers.FieldError{
					{
						Field:   "authorization",
						Message: "Invalid authorization format. Use 'Bearer <token>'",
						Code:    "INVALID_AUTH_FORMAT",
					},
				},
			},
		}
	}

	return tokenString, nil
}

// SetJWTSecret - Set JWT secret from environment variable
func SetJWTSecret(secret string) {
	if secret == "" {
		secret = "default-secret-key-change-in-production"
	}
	jwtSecret = []byte(secret)
}
