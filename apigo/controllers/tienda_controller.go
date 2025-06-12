package controllers

import (
	"context"
	cbd "go-api/coneccion"
	"go-api/models"
	"go-api/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func PostTienda(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	userID := c.Param("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Falta ID de usuario"})
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario no válido"})
		return
	}

	//Se realiza la validación del plan del usuario antes de crear la tienda,
	// estoy mandando nulo el tercer parámetro por que ese es sólo para crear productos, no tiendas
	validarPlan, err := util.ValidatePlan(userObjID, 1, primitive.NilObjectID)
	if !validarPlan || err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "El plan del usuario no permite crear más tiendas"})
		return
	}

	// Payload sin users
	type Payload struct {
		Name      string `json:"name"`
		DNI       string `json:"dni"`
		Logo      string `json:"logo"`
		Facebook  string `json:"facebook"`
		Instagram string `json:"instagram"`
		TikTok    string `json:"tiktok"`
		LinkStore string `json:"link_store"`
		IsGlobal  bool   `json:"isGlobal"`
	}

	var body Payload
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de la tienda no son válidos"})
		return
	}

	tienda := models.Tienda{
		ID:        primitive.NewObjectID(),
		Name:      body.Name,
		DNI:       body.DNI,
		Logo:      body.Logo,
		Facebook:  body.Facebook,
		Instagram: body.Instagram,
		TikTok:    body.TikTok,
		LinkStore: body.LinkStore,
		IsGlobal:  body.IsGlobal,
		Users: []models.UserRef{
			{
				UserID: userObjID,
				Role:   "1", //Asigna rol 1 (admin) por defecto al que crea la tienda
			},
		},
		Publications: []models.Producto{},
	}

	_, err = collection.InsertOne(context.TODO(), tienda)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear tienda"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tienda creada correctamente",
		"tienda":  tienda,
	})
}

func PutTienda(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	tiendaID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(tiendaID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de tienda no válido"})
		return
	}

	var tienda models.Tienda
	if err := c.ShouldBindJSON(&tienda); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de la tienda no son válidos"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"name":       tienda.Name,
			"dni":        tienda.DNI,
			"logo":       tienda.Logo,
			"facebook":   tienda.Facebook,
			"instagram":  tienda.Instagram,
			"tiktok":     tienda.TikTok,
			"isGlobal":   tienda.IsGlobal,
			"link_store": tienda.LinkStore,
		},
	}

	filter := bson.M{"_id": objID}
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar tienda"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tienda no encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tienda actualizada correctamente"})
}

func GetTiendasPorUsuario(c *gin.Context) {
	userId := c.Param("userID")                       //sacar id de usaurio de los params
	idfinal, err := primitive.ObjectIDFromHex(userId) //parsear a uId de mongo

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
		return
	}

	tiendas, err := models.GetTiendasByUserID(idfinal) //traer tiendas del usuario
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error en get tiendas"})
		return
	}

	c.JSON(http.StatusOK, tiendas)
}
