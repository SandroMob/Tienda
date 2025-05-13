package controllers

import (
	"context"
	cbd "go-api/coneccion"
	"go-api/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetListadoUsuarios(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("user")

	projection := bson.M{
		"nombre":   1,
		"apellido": 1,
		"_id":      1,
	}

	cursor, err := collection.Find(context.TODO(), bson.M{}, options.Find().SetProjection(projection))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al consultar listado usuarios"})
		return
	}
	defer cursor.Close(context.TODO())
	var cargas []bson.M
	if err = cursor.All(context.TODO(), &cargas); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar los resultados"})
		return
	}
	c.JSON(http.StatusOK, cargas)
}

func EditarUsuario(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("user")
	var usuarioActualizado models.Usuario
	if err := c.ShouldBindJSON(&usuarioActualizado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	idfinal, err := primitive.ObjectIDFromHex(usuarioActualizado.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
		return
	}
	filter := bson.M{"_id": idfinal}
	update := bson.M{
		"$set": bson.M{
			"nombre":   usuarioActualizado.Nombre,
			"apellido": usuarioActualizado.Apellido,
			"email":    usuarioActualizado.Email,
		},
	}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el usuario"})
		return
	}
	log.Printf("Id user: %v\n", result)

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Usuario actualizado correctamente"})
}

func GetUsuario(c *gin.Context) {
	userId := c.Param("id")

	idfinal, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
		return
	}

	usuario, err := models.GetUsuarioById(idfinal)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"usuario": gin.H{
			"id":       usuario.ID,
			"nombre":   usuario.Nombre,
			"apellido": usuario.Apellido,
			"email":    usuario.Email,
		},
	})
}
