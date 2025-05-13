package controllers

import (
	"context"
	cbd "go-api/coneccion"
	"go-api/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CargarDatos(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("TestSMVC").Collection("cargas")
	var cargas []models.CargaSaldos
	if err := c.ShouldBindJSON(&cargas); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos carga temporal"})
		return
	}
	var docs []interface{}
	for _, carga := range cargas {
		if carga.Fondo == "" || carga.Serie == "" || carga.Run == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Campos requeridos faltantes en la carga"})
			return
		}
		// Crear documento para insertar
		docs = append(docs, bson.M{
			"fondo":               carga.Fondo,
			"serie":               carga.Serie,
			"run":                 carga.Run,
			"fecha":               carga.Fecha,
			"nroParticipes":       carga.NroParticipes,
			"nroParticipesIns":    carga.NroParticipesIns,
			"nroCuotasEmitidas":   carga.NroCuotasEmitidas,
			"nroCuotasPagadas":    carga.NroCuotasPagadas,
			"valorCuotaEconomico": carga.ValorCuotaEconomico,
			"patrimonioNeto":      carga.PatrimonioNeto,
			"activoTotal":         carga.ActivoTotal,
			"valorCuotaLibro":     carga.ValorCuotaLibro,
			"id_usuario":          carga.Id_Usuario,
			"fechaCreacion":       time.Now(),
		})
	}
	_, err := collection.InsertMany(context.TODO(), docs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al insertar los datos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cargas agregadas exitosamente"})
}

func GetCargasByUserId(c *gin.Context) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("TestSMVC").Collection("cargas")

	// Obtener el id_usuario (opcional)
	userId := c.DefaultQuery("id_usuario", "")

	// Crear el filtro base
	filter := bson.M{}

	// Si se proporciona un id_usuario, agregarlo al filtro
	if userId != "" && userId != "0" {
		idfinal, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
			return
		}
		filter["id_usuario"] = idfinal
	}

	fechaDesde := c.DefaultQuery("fechaDesde", "")
	fechaHasta := c.DefaultQuery("fechaHasta", "")

	fechaFiltro := bson.M{}
	if fechaDesde != "" {
		fechaDesdeTime, err := time.Parse(time.RFC3339, fechaDesde)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fechaDesde inválido"})
			return
		}
		fechaFiltro["$gte"] = primitive.NewDateTimeFromTime(fechaDesdeTime)
	}
	if fechaHasta != "" {
		fechaHastaTime, err := time.Parse(time.RFC3339, fechaHasta)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fechaHasta inválido"})
			return
		}
		fechaFiltro["$lte"] = primitive.NewDateTimeFromTime(fechaHastaTime)
	}
	if len(fechaFiltro) > 0 {
		filter["fecha"] = fechaFiltro
	}

	fechaCreacionDesde := c.DefaultQuery("fechaCreacionDesde", "")
	fechaCreacionHasta := c.DefaultQuery("fechaCreacionHasta", "")
	fechaCreacionFiltro := bson.M{}
	if fechaCreacionDesde != "" {
		fechaDesdeTime, err := time.Parse(time.RFC3339, fechaCreacionDesde)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fechaCreacionDesde inválido"})
			return
		}
		fechaCreacionFiltro["$gte"] = primitive.NewDateTimeFromTime(fechaDesdeTime)
	}
	if fechaCreacionHasta != "" {
		fechaHastaTime, err := time.Parse(time.RFC3339, fechaCreacionHasta)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fechaCreacionHasta inválido"})
			return
		}
		fechaCreacionFiltro["$lte"] = primitive.NewDateTimeFromTime(fechaHastaTime)
	}
	if len(fechaCreacionFiltro) > 0 {
		filter["fechaCreacion"] = fechaCreacionFiltro
	}

	nombreFondo := c.DefaultQuery("nombreFondo", "")
	if nombreFondo != "" {
		filter["fondo"] = bson.M{
			"$regex":   nombreFondo,
			"$options": "i",
		}
	}
	pipeline := bson.A{
		bson.M{
			"$match": filter, // Filtro inicial para las cargas
		},
		bson.M{
			"$lookup": bson.M{
				"from":         "users",      // Colección de usuarios
				"localField":   "id_usuario", // Campo en la colección de cargas
				"foreignField": "_id",        // Campo en la colección de usuarios
				"as":           "usuario",    // Alias para el resultado del cruce
			},
		},
		bson.M{
			"$unwind": bson.M{
				"path":                       "$usuario",
				"preserveNullAndEmptyArrays": true, // Permite que las cargas sin usuario no se descarten
			},
		},
		bson.M{
			"$addFields": bson.M{
				"nombreUsuario": bson.M{
					"$concat": bson.A{"$usuario.nombre", " ", "$usuario.apellido"}, // Concatenar Nombre y Apellido
				},
			},
		},
		bson.M{
			"$project": bson.M{
				"usuario": 0, // Excluir el campo "usuario" del resultado
			},
		},
	}

	// Ejecutar la agregación
	cursor, err := collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al consultar las cargas"})
		return
	}
	defer cursor.Close(context.TODO())

	// Decodificar los resultados
	var cargas []bson.M
	if err = cursor.All(context.TODO(), &cargas); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar los resultados"})
		return
	}

	// Devolver los resultados
	c.JSON(http.StatusOK, cargas)
}
