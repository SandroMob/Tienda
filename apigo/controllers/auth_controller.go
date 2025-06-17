package controllers

import (
	"fmt"
	"go-api/models"
	"go-api/util"
	"net/http"
	"regexp"
	"strings"

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
	loginData.Pass = models.Encrypt(loginData.Pass)
	fmt.Println("Contraseña encriptada:", loginData.Pass)
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

func Register(c *gin.Context) {
	var registerData struct {
		Nombre   string `json:"nombre" binding:"required"`
		Apellido string `json:"apellido" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Pass     string `json:"pass" binding:"required"`
	}

	if err := c.ShouldBindJSON(&registerData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	// Validar formato de email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(registerData.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de email inválido"})
		return
	}

	// Validar longitud de contraseña
	if len(registerData.Pass) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La contraseña debe tener al menos 6 caracteres"})
		return
	}

	// Limpiar y validar datos
	registerData.Email = strings.ToLower(strings.TrimSpace(registerData.Email))
	registerData.Nombre = strings.TrimSpace(registerData.Nombre)
	registerData.Apellido = strings.TrimSpace(registerData.Apellido)

	if registerData.Nombre == "" || registerData.Apellido == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nombre y apellido son obligatorios"})
		return
	}

	// Verificar si el usuario ya existe
	existingUser, err := models.GetUsuarioByEmail(registerData.Email)
	if err == nil && existingUser != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El email ya está registrado"})
		return
	}

	// Crear nuevo usuario
	nuevoUsuario := models.Usuario{
		Nombre:   registerData.Nombre,
		Apellido: registerData.Apellido,
		Email:    registerData.Email,
		Pass:     registerData.Pass, // Nota: Considera hashear la contraseña
	}

	// Guardar usuario en la base de datos
	usuarioCreado, err := models.CreateUsuario(nuevoUsuario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el usuario"})
		return
	}

	// Generar JWT para el nuevo usuario
	token, err := util.GenerateJWT(*usuarioCreado)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el token"})
		return
	}

	// Devolver la respuesta con el token y la información del usuario
	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuario registrado exitosamente",
		"token":   token,
		"usuario": gin.H{
			"id":       usuarioCreado.ID,
			"nombre":   usuarioCreado.Nombre,
			"apellido": usuarioCreado.Apellido,
			"email":    usuarioCreado.Email,
		},
	})
}
