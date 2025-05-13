package middleware

import (
	"go-api/util"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token requerido."})
			c.Abort()
			return
		}

		const bearerPrefix = "Bearer "
		if strings.HasPrefix(tokenString, bearerPrefix) {
			tokenString = strings.TrimPrefix(tokenString, bearerPrefix)
		}

		token, err := util.ValidateJWT(tokenString)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
			c.Abort()
			return
		}
	}
}
