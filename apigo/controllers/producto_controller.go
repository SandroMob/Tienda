package controllers

import (
	"context"
	"fmt"
	cbd "go-api/coneccion"
	"go-api/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

//ESCRITURA

func PostProducto(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	storeID := c.Param("storeId")
	if storeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Falta ID de la tienda"})
		return
	}

	storeObjID, err := primitive.ObjectIDFromHex(storeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de tienda no válido"})
		return
	}

	var producto models.Producto
	if err := c.ShouldBindJSON(&producto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos del producto no son válidos"})
		return
	}

	producto.ID = primitive.NewObjectID()

	filter := bson.M{"_id": storeObjID}
	update := bson.M{
		"$push": bson.M{
			"publications": producto,
		},
	}

	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al agregar producto"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Producto creado correctamente"})
}

func PutProducto(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	storeID := c.Param("storeId")
	productoID := c.Param("productoId")

	storeObjID, err := primitive.ObjectIDFromHex(storeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de tienda no válido"})
		return
	}

	prodObjID, err := primitive.ObjectIDFromHex(productoID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto no válido"})
		return
	}

	var producto models.Producto
	if err := c.ShouldBindJSON(&producto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos del producto no son válidos"})
		return
	}

	filter := bson.M{
		"_id":              storeObjID,
		"publications._id": prodObjID,
	}

	update := bson.M{
		"$set": bson.M{
			"publications.$.title":           producto.Title,
			"publications.$.description":     producto.Description,
			"publications.$.longDescription": producto.LongDescription,
			"publications.$.price":           producto.Price,
			"publications.$.categoria":       producto.Categoria,
			"publications.$.phone":           producto.Phone,
			"publications.$.storeName":       producto.StoreName,
			"publications.$.storeDNI":        producto.StoreDNI,
			"publications.$.storeLogo":       producto.StoreLogo,
			"publications.$.facebookLink":    producto.FacebookLink,
			"publications.$.instagramLink":   producto.InstagramLink,
			"publications.$.images":          producto.Images,
		},
	}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar producto"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Producto no encontrado en la tienda"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Producto actualizado correctamente"})
}

//LECTURA

func GetProductosPorTienda(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	storeID := c.Param("storeId")
	if storeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Falta ID de la tienda"})
		return
	}

	storeObjID, err := primitive.ObjectIDFromHex(storeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de tienda no válido"})
		return
	}

	// Obtener palabra clave desde query param
	keyword := strings.ToLower(c.Query("q"))

	// Buscar la tienda por su ID
	var store struct {
		Publications []models.Producto `bson:"publications"`
	}

	err = collection.FindOne(context.TODO(), bson.M{"_id": storeObjID}).Decode(&store)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tienda no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener datos de la tienda"})
		}
		return
	}

	// Si no hay palabra clave, retorna todo
	if keyword == "" {
		c.JSON(http.StatusOK, store.Publications)
		return
	}

	// Filtrar resultados por palabra clave (case insensitive)
	var filtered []models.Producto
	for _, p := range store.Publications {
		if strings.Contains(strings.ToLower(p.Title), keyword) ||
			strings.Contains(strings.ToLower(p.Description), keyword) ||
			strings.Contains(strings.ToLower(p.Categoria), keyword) ||
			strings.Contains(fmt.Sprintf("%.2f", p.Price), keyword) {
			filtered = append(filtered, p)
		}
	}

	c.JSON(http.StatusOK, filtered)
}
