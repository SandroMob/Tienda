package util

import (
	"go-api/models"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecret = []byte("46t41hyv2ga5asda23asDf343251vsdf")

func GenerateJWT(usuario models.Usuario) (string, error) {
	claims := jwt.MapClaims{
		"id":             usuario.ID,
		"nombre":         usuario.Nombre,
		"apellido":       usuario.Apellido,
		"email":          usuario.Email,
		"fecha_creacion": usuario.FechaCreacion,
		"exp":            time.Now().Add(2 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
}
