package controllers

import (
	"go-api/models"
	"go-api/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var loginData struct {
		Email string `json:"email" binding:"required"`
		Pass  string `json:"pass" binding:"required"`
	}
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	//Buscar usuario en la base de datos
	usuario, err := models.GetUsuarioByEmail(loginData.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario o contraseña incorrectos"})
		return
	}

	//Validar contraseña
	if usuario.Pass != loginData.Pass {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario o contraseña incorrectos"})
		return
	}

	// Generar JWT
	token, err := util.GenerateJWT(*usuario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el token"})
		return
	}

	// Devolver la respuesta con el token y la información del usuario
	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"usuario": gin.H{
			"id":       usuario.ID,
			"nombre":   usuario.Nombre,
			"apellido": usuario.Apellido,
			"email":    usuario.Email,
		},
	})
}
