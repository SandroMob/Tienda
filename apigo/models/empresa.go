package models

import (
	"context"
	cbd "go-api/coneccion"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Empresa struct {
	Id            string `bson:"_id,omitempty" json:"_id"`
	RazonSocial   string `bson:"razonSocial,omitempty" json:"razonSocial"`
	FechaCreacion string `bson:"fechaCreacion,omitempty" json:"fechaCreacion"`
	ClaveSII      string `bson:"claveSII,omitempty" json:"claveSII"`
	RutEmpresa    string `bson:"rutEmpresa,omitempty" json:"rutEmpresa"`
}

func GetEmpresaByID(idEmpresa primitive.ObjectID) (*Empresa, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("TestSMVC").Collection("empresas")

	var empresa Empresa
	filter := bson.M{"_id": idEmpresa}

	err := collection.FindOne(context.TODO(), filter).Decode(&empresa)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Empresa no encontrada con ID: %v\n", idEmpresa)
			return nil, err
		}
		log.Printf("Error al buscar la empresa: %v\n", err)
		return nil, err
	}

	return &empresa, nil
}
