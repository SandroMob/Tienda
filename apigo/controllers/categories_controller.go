package controllers

import (
	"context"
	cbd "go-api/coneccion"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetCategorias(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("categories")
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener categorías"})
		return
	}
	defer cursor.Close(context.TODO())
	var categorias []bson.M
	if err := cursor.All(context.TODO(), &categorias); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar resultados"})
		return
	}
	c.JSON(http.StatusOK, categorias)
}
