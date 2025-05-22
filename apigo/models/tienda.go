package models

import (
	"context"
	cbd "go-api/coneccion"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Tienda struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Name         string             `bson:"name"`
	DNI          string             `bson:"dni"`
	Logo         string             `bson:"logo"`
	Facebook     string             `bson:"facebook"`
	Instagram    string             `bson:"instagram"`
	TikTok       string             `bson:"tiktok"`
	LinkStore    string             `bson:"link_store"`
	Users        []UserRef          `bson:"users"`
	Publications []Producto         `bson:"publications"`
}

type UserRef struct {
	UserID primitive.ObjectID `bson:"userID"`
	Role   string             `bson:"role"`
}

func GetTiendasByUserID(userID primitive.ObjectID) ([]Tienda, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("stores")

	filter := bson.M{
		"users.userID": userID,
	}

	// Excluir publications del resultado
	projection := bson.M{
		"publications": 0,
	}

	opts := options.Find().SetProjection(projection)

	cursor, err := collection.Find(context.TODO(), filter, opts)
	if err != nil {
		log.Printf("Error al buscar tiendas: %v\n", err)
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var tiendas []Tienda
	if err := cursor.All(context.TODO(), &tiendas); err != nil {
		log.Printf("Error al decodificar tiendas: %v\n", err)
		return nil, err
	}
	if len(tiendas) == 0 {
		log.Println("No se encontraron tiendas para el userID.")
	}

	return tiendas, nil
}
