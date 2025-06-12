package models

import (
	"context"
	cbd "go-api/coneccion"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Producto struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title           string             `bson:"title" json:"title"`
	Description     string             `bson:"description" json:"description"`
	LongDescription string             `bson:"longDescription" json:"longDescription"`
	Price           float64            `bson:"price" json:"price"`
	Categoria       string             `bson:"categoria" json:"categoria"`
	Images          []string           `bson:"images" json:"images"`
}

func GetCantidadProductosStoreId(storeId primitive.ObjectID) int {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	// Solo proyectamos el campo "publications"
	filter := bson.M{"_id": storeId}
	// Proyection es un map que especifica los campos a incluir o excluir en el filtro
	projection := bson.M{"publications": 1}
	var result struct {
		Publications []bson.M `bson:"publications"`
	}
	// Usamos FindOne para obtener un único documento que coincida con el filtro
	err := collection.FindOne(context.TODO(), filter, options.FindOne().SetProjection(projection)).Decode(&result)
	if err != nil {
		log.Printf("Error al obtener publicaciones de la tienda: %v\n", err)
		return 0
	}
	return len(result.Publications)
}
