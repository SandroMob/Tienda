package controllers

import (
	"go-api/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetTiendasPorUsuario(c *gin.Context) {
	userId := c.Param("userID")                       //sacar id de usaurio de los params
	idfinal, err := primitive.ObjectIDFromHex(userId) //parsear a uId de mongo

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
		return
	}

	tiendas, err := models.GetTiendasByUserID(idfinal) //traer tiendas del usuario
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": strings.Split(err.Error(), "")})
		return
	}

	c.JSON(http.StatusOK, tiendas)
}
