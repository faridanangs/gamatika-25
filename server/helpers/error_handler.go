package helpers

import (
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// AppError represents an application error
type AppError struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

func (e *AppError) Error() string {
	return e.Message
}

// CustomErrorResponse is the structure for clearer error responses
type CustomErrorResponse struct {
	Status  string       `json:"status"`
	Message string       `json:"message"`
	Errors  []FieldError `json:"errors,omitempty"`
}

// FieldError stores detailed error information per field
type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Code    string `json:"code"`
}

// HandleValidationErrors handles validation errors and returns a consistent response format
func HandleValidationErrors(v *validator.Validate, s any, c *fiber.Ctx) bool {
	err := v.Struct(s)
	if err == nil {
		return false // No validation errors
	}

	var validationErrors validator.ValidationErrors
	var ok bool
	if validationErrors, ok = err.(validator.ValidationErrors); !ok {
		// Handle non-validation errors
		c.Status(fiber.StatusInternalServerError).JSON(&CustomErrorResponse{
			Status:  "error",
			Message: "An error occurred while validating data",
			Errors: []FieldError{
				{
					Field:   "validation",
					Message: "An error occurred while validating data",
					Code:    "VALIDATION_ERROR",
				},
			},
		})
		return true
	}

	errorResponse := &CustomErrorResponse{
		Status:  "error",
		Message: "Validation failed for the request data",
		Errors:  make([]FieldError, 0),
	}

	for _, fieldError := range validationErrors {
		fieldName := getReadableFieldName(fieldError.Field())
		fieldCode := getFieldCode(fieldError.Field())
		var message string
		var code string

		switch fieldError.Tag() {
		case "required":
			message = fmt.Sprintf("%s is required", fieldName)
			code = fieldCode + "_REQUIRED"
		case "min":
			if fieldError.Field() == "Password" {
				message = fmt.Sprintf("%s must be at least %s characters", fieldName, fieldError.Param())
			} else {
				message = fmt.Sprintf("%s must be at least %s characters", fieldName, fieldError.Param())
			}
			code = fieldCode + "_MIN_LENGTH"
		case "max":
			if fieldError.Field() == "Images" {
				message = fmt.Sprintf("Maximum %s images allowed", fieldError.Param())
				code = fieldCode + "_MAX_IMAGES"
			} else {
				message = fmt.Sprintf("%s must not exceed %s characters", fieldName, fieldError.Param())
				code = fieldCode + "_MAX_LENGTH"
			}
		case "email":
			message = fmt.Sprintf("Invalid %s format. Example: name@example.com", fieldName)
			code = fieldCode + "_INVALID_FORMAT"
		case "numeric":
			message = fmt.Sprintf("%s must contain only numbers", fieldName)
			code = fieldCode + "_NUMERIC_ONLY"
		case "alphanum":
			message = fmt.Sprintf("%s can only contain letters and numbers", fieldName)
			code = fieldCode + "_ALPHANUM_ONLY"
		default:
			message = fmt.Sprintf("Invalid value for %s", fieldName)
			code = fieldCode + "_INVALID_VALUE"
		}

		errorResponse.Errors = append(errorResponse.Errors, FieldError{
			Field:   strings.ToLower(fieldError.Field()),
			Message: message,
			Code:    code,
		})
	}

	c.Status(fiber.StatusBadRequest).JSON(errorResponse)
	return true
}

// DatabaseErrorHandler handles database errors
type DatabaseErrorHandler struct{}

func NewDatabaseErrorHandler() *DatabaseErrorHandler {
	return &DatabaseErrorHandler{}
}

func (h *DatabaseErrorHandler) HandleError(err error, operation string) *AppError {
	if err == nil {
		return nil
	}

	// Handle GORM specific errors
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return &AppError{
			Code:    fiber.StatusNotFound,
			Message: "The requested resource was not found",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "The requested resource was not found",
				Errors: []FieldError{
					{
						Field:   "resource",
						Message: "The requested resource was not found",
						Code:    "RESOURCE_NOT_FOUND",
					},
				},
			},
		}
	}

	// Handle PostgreSQL specific errors
	var pgErr *pq.Error
	if errors.As(err, &pgErr) {
		return h.handlePostgresError(pgErr, operation)
	}

	// Handle duplicate key error by parsing error message
	if h.isDuplicateKeyError(err) {
		return h.handleDuplicateKeyError(err, operation)
	}

	// Handle other database errors
	return &AppError{
		Code:    fiber.StatusInternalServerError,
		Message: "A database error occurred",
		Details: &CustomErrorResponse{
			Status:  "error",
			Message: "A database error occurred",
			Errors: []FieldError{
				{
					Field:   "database",
					Message: "A database error occurred",
					Code:    "DATABASE_ERROR",
				},
			},
		},
	}
}

// Check if error is a duplicate key error by parsing the error message
func (h *DatabaseErrorHandler) isDuplicateKeyError(err error) bool {
	errStr := err.Error()
	return strings.Contains(errStr, "duplicate key value violates unique constraint") ||
		strings.Contains(errStr, "SQLSTATE 23505")
}

// Handle duplicate key errors by extracting field name from error message
func (h *DatabaseErrorHandler) handleDuplicateKeyError(err error, operation string) *AppError {
	errStr := err.Error()

	// Extract constraint name using regex
	re := regexp.MustCompile(`unique constraint "([^"]+)"`)
	matches := re.FindStringSubmatch(errStr)

	var fieldName string
	if len(matches) > 1 {
		constraintName := matches[1]
		fieldName = h.extractFieldNameFromConstraint(constraintName)
	}

	if fieldName == "" {
		// Try to extract field name from error message
		if strings.Contains(errStr, "email") {
			fieldName = "email"
		} else if strings.Contains(errStr, "username") {
			fieldName = "username"
		} else if strings.Contains(errStr, "nim") {
			fieldName = "nim"
		}
	}

	if fieldName == "" {
		return &AppError{
			Code:    fiber.StatusConflict,
			Message: "A record with this information already exists",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "A record with this information already exists",
				Errors: []FieldError{
					{
						Field:   "unique",
						Message: "A record with this information already exists",
						Code:    "UNIQUE_VIOLATION",
					},
				},
			},
		}
	}

	readableName := getReadableFieldName(fieldName)
	fieldCode := h.getFieldCode(fieldName)

	return &AppError{
		Code:    fiber.StatusConflict,
		Message: fmt.Sprintf("%s already exists", readableName),
		Details: &CustomErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("%s already exists", readableName),
			Errors: []FieldError{
				{
					Field:   strings.ToLower(fieldName),
					Message: fmt.Sprintf("%s already exists", readableName),
					Code:    fieldCode + "_EXISTS",
				},
			},
		},
	}
}

// Extract field name from constraint name
func (h *DatabaseErrorHandler) extractFieldNameFromConstraint(constraint string) string {
	// Handle constraint patterns:
	// - "idx_users_email" -> "email"
	// - "users_username_key" -> "username"
	// - "users_email_key" -> "email"

	parts := strings.Split(constraint, "_")
	if len(parts) < 2 {
		return ""
	}

	// Skip common prefixes like "idx", "users", "key"
	for _, part := range parts {
		lowerPart := strings.ToLower(part)
		if lowerPart != "idx" &&
			lowerPart != "users" &&
			lowerPart != "key" &&
			lowerPart != "pkey" &&
			lowerPart != "fkey" {
			return part
		}
	}

	// If no clear field name, return the last part
	return parts[len(parts)-1]
}

func (h *DatabaseErrorHandler) handlePostgresError(pgErr *pq.Error, operation string) *AppError {
	switch pgErr.Code {
	// Unique constraint violation
	case "23505":
		return h.handleUniqueViolation(pgErr, operation)

	// Foreign key violation
	case "23503":
		return &AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Referenced record does not exist",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "Referenced record does not exist",
				Errors: []FieldError{
					{
						Field:   "reference",
						Message: "Referenced record does not exist",
						Code:    "REFERENCE_NOT_FOUND",
					},
				},
			},
		}

	// Check constraint violation
	case "23514":
		return &AppError{
			Code:    fiber.StatusBadRequest,
			Message: "Data validation failed",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "Data validation failed",
				Errors: []FieldError{
					{
						Field:   "validation",
						Message: "Data validation failed",
						Code:    "VALIDATION_FAILED",
					},
				},
			},
		}

	// Not null violation
	case "23502":
		fieldName := h.extractFieldNameFromColumn(pgErr.Column, pgErr.Constraint)
		readableName := getReadableFieldName(fieldName)
		fieldCode := h.getFieldCode(fieldName)

		return &AppError{
			Code:    fiber.StatusBadRequest,
			Message: fmt.Sprintf("%s is required", readableName),
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("%s is required", readableName),
				Errors: []FieldError{
					{
						Field:   strings.ToLower(fieldName),
						Message: fmt.Sprintf("%s is required", readableName),
						Code:    fieldCode + "_REQUIRED",
					},
				},
			},
		}

	// Default PostgreSQL error
	default:
		return &AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Database operation failed",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "Database operation failed",
				Errors: []FieldError{
					{
						Field:   "database",
						Message: "Database operation failed",
						Code:    "DATABASE_OPERATION_FAILED",
					},
				},
			},
		}
	}
}

func (h *DatabaseErrorHandler) handleUniqueViolation(pgErr *pq.Error, operation string) *AppError {
	// Extract field name from column or constraint
	fieldName := h.extractFieldNameFromColumn(pgErr.Column, pgErr.Constraint)
	if fieldName == "" {
		// Try to extract from constraint name
		fieldName = h.extractFieldNameFromConstraint(pgErr.Constraint)
	}

	readableName := getReadableFieldName(fieldName)
	fieldCode := h.getFieldCode(fieldName)

	if readableName == "" {
		return &AppError{
			Code:    fiber.StatusConflict,
			Message: "A record with this information already exists",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "A record with this information already exists",
				Errors: []FieldError{
					{
						Field:   "unique",
						Message: "A record with this information already exists",
						Code:    "UNIQUE_VIOLATION",
					},
				},
			},
		}
	}

	return &AppError{
		Code:    fiber.StatusConflict,
		Message: fmt.Sprintf("%s already exists", readableName),
		Details: &CustomErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("%s already exists", readableName),
			Errors: []FieldError{
				{
					Field:   strings.ToLower(fieldName),
					Message: fmt.Sprintf("%s already exists", readableName),
					Code:    fieldCode + "_EXISTS",
				},
			},
		},
	}
}

// Extract field name from column or constraint
func (h *DatabaseErrorHandler) extractFieldNameFromColumn(column, constraint string) string {
	if column != "" {
		return column
	}

	// Fallback to constraint name parsing
	if constraint == "" {
		return ""
	}

	parts := strings.Split(constraint, "_")
	if len(parts) < 2 {
		return ""
	}

	// Skip common prefixes like "idx", "users", "key"
	for _, part := range parts {
		lowerPart := strings.ToLower(part)
		if lowerPart != "idx" &&
			lowerPart != "users" &&
			lowerPart != "key" &&
			lowerPart != "pkey" &&
			lowerPart != "fkey" {
			return part
		}
	}

	// If no clear field name, return the last part
	return parts[len(parts)-1]
}

// Get field code for error messages
func (h *DatabaseErrorHandler) getFieldCode(fieldName string) string {
	fieldCodeMap := map[string]string{
		"email":          "EMAIL",
		"username":       "USERNAME",
		"nim":            "NIM",
		"full_name":      "FULL_NAME",
		"prodi":          "PRODI",
		"wallet_address": "WALLET_ADDRESS",
		"private_key":    "PRIVATE_KEY",
		"avatar":         "AVATAR",
		"password":       "PASSWORD",
		"id":             "ID",
		"user_id":        "USER_ID",
		"post_id":        "POST_ID",
	}

	if code, exists := fieldCodeMap[strings.ToLower(fieldName)]; exists {
		return code
	}
	return strings.ToUpper(fieldName)
}

func (h *DatabaseErrorHandler) HandleTransactionError(err error, operation string) *AppError {
	if err == nil {
		return nil
	}

	// Check if it's a transaction rollback error
	if strings.Contains(err.Error(), "transaction has already been committed or rolled back") {
		return &AppError{
			Code:    fiber.StatusInternalServerError,
			Message: "Transaction error",
			Details: &CustomErrorResponse{
				Status:  "error",
				Message: "Transaction error",
				Errors: []FieldError{
					{
						Field:   "transaction",
						Message: "Transaction state error",
						Code:    "TRANSACTION_ERROR",
					},
				},
			},
		}
	}

	// Handle other transaction errors
	return h.HandleError(err, operation)
}

// Get field code for error messages
func getFieldCode(field string) string {
	fieldCodeMap := map[string]string{
		"FullName":       "FULL_NAME",
		"Username":       "USERNAME",
		"Email":          "EMAIL",
		"Password":       "PASSWORD",
		"Nim":            "NIM",
		"Prodi":          "PRODI",
		"WalletAddress":  "WALLET_ADDRESS",
		"PrivateKey":     "PRIVATE_KEY",
		"Title":          "TITLE",
		"Content":        "CONTENT",
		"Images":         "IMAGES",
		"username":       "USERNAME",
		"email":          "EMAIL",
		"nim":            "NIM",
		"full_name":      "FULL_NAME",
		"prodi":          "PRODI",
		"wallet_address": "WALLET_ADDRESS",
		"private_key":    "PRIVATE_KEY",
		"avatar":         "AVATAR",
		"password":       "PASSWORD",
		"id":             "ID",
		"user_id":        "USER_ID",
		"post_id":        "POST_ID",
		"Achievements":   "ACHIEVEMENTS",
	}

	if code, exists := fieldCodeMap[field]; exists {
		return code
	}
	return strings.ToUpper(field)
}

// Function to convert field names to more readable format
func getReadableFieldName(field string) string {
	fieldMap := map[string]string{
		"FullName":       "Full Name",
		"Username":       "Username",
		"Email":          "Email",
		"Password":       "Password",
		"Nim":            "Student ID",
		"Prodi":          "Study Program",
		"WalletAddress":  "Wallet Address",
		"PrivateKey":     "Private Key",
		"Title":          "Title",
		"Content":        "Content",
		"Images":         "Images",
		"username":       "Username",
		"email":          "Email",
		"nim":            "Student ID",
		"full_name":      "Full Name",
		"prodi":          "Study Program",
		"wallet_address": "Wallet Address",
		"private_key":    "Private Key",
		"avatar":         "Avatar",
		"password":       "Password",
		"id":             "ID",
		"user_id":        "User ID",
		"post_id":        "Post ID",
		"Achievements":   "Achievements",
	}

	if readableName, exists := fieldMap[field]; exists {
		return readableName
	}
	return field
}

func HelperErrNotNil(err error, c *fiber.Ctx) error {
	if err != nil {
		var appErr *AppError
		if errors.As(err, &appErr) {
			if customErr, ok := appErr.Details.(*CustomErrorResponse); ok {
				return c.Status(appErr.Code).JSON(customErr)
			}

			return c.Status(appErr.Code).JSON(&CustomErrorResponse{
				Status:  "error",
				Message: appErr.Message,
				Errors: []FieldError{
					{
						Field:   "general",
						Message: appErr.Message,
						Code:    "GENERAL_ERROR",
					},
				},
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(&CustomErrorResponse{
			Status:  "error",
			Message: "An unexpected error occurred",
			Errors: []FieldError{
				{
					Field:   "system",
					Message: "An unexpected error occurred",
					Code:    "UNEXPECTED_ERROR",
				},
			},
		})
	}

	return nil
}

func HelperInvalidReqBody(err error, c *fiber.Ctx) error {
	return c.Status(fiber.StatusBadRequest).JSON(&CustomErrorResponse{
		Status:  "error",
		Message: "Invalid request body",
		Errors: []FieldError{
			{
				Field:   "request",
				Message: "Invalid request body",
				Code:    "INVALID_REQUEST_BODY",
			},
		},
	})
}
