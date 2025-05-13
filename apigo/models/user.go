package models

import (
	"context"
	cbd "go-api/coneccion"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Usuario struct {
	ID            string    `bson:"_id,omitempty" json:"_id"`
	Nombre        string    `bson:"nombre" json:"nombre"`
	Apellido      string    `bson:"apellido" json:"apellido"`
	Email         string    `bson:"email" json:"email"`
	Pass          string    `bson:"pass" json:"-"`
	FechaCreacion time.Time `bson:"fecha_creacion" json:"fecha_creacion"`
	IdEmpresa     string    `bson:"id_empresa" json:"id_empresa"`
}

func GetUsuarioByEmail(email string) (*Usuario, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("user")

	var usuario Usuario
	err := collection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&usuario)
	if err == mongo.ErrNoDocuments {
		return nil, err
	}
	return &usuario, err
}

func GetUsuarioById(id primitive.ObjectID) (*Usuario, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("user")
	filter := bson.M{"_id": id}
	var usuario Usuario
	err := collection.FindOne(context.TODO(), filter).Decode(&usuario)
	if err == mongo.ErrNoDocuments {
		return nil, err
	}
	return &usuario, err
}
