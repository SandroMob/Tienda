package controllers

import (
	"context"
	cbd "go-api/coneccion"
	"go-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetEmpresas(c *gin.Context) {
	client := cbd.GetInstanciaBd()

	collection := client.Database("TestSMVC").Collection("empresas")
	cursor, err := collection.Find(context.TODO(), bson.D{{}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())
	var empresas []bson.M
	if err = cursor.All(context.TODO(), &empresas); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, empresas)
}

func PatchEmpresa(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	//entidad relacionada a la operación
	collection := client.Database("TestSMVC").Collection("empresas")
	var empresa models.Empresa
	//deserializa el modelo enviado desde la app
	if err := c.ShouldBindJSON(&empresa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de empresa no son válidos"})
		return
	}
	//parsea el id enviado al tipo idhex de mongo db
	idfinal, err := primitive.ObjectIDFromHex(empresa.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id empresa no válido"})
		return
	}
	//aplica los filtros para editar el documento mongo
	filter := bson.M{"_id": idfinal}
	update := bson.M{
		//valores que se van a setear
		"$set": bson.M{
			"razonSocial": empresa.RazonSocial,
			"claveSII":    empresa.ClaveSII,
			"rutEmpresa":  empresa.RutEmpresa,
		},
	}
	//aplicar la operación con los indicativos anteriores, campos y filtros
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar empresa"})
		return
	}
	//el machedcount es la cantidad de documentos que se editaron, si es 0 es que no econtró la empresa por el id
	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Empresa no encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Empresa actualizada correctamente"})
}
