package util

import (
	"context"
	"log"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

const cnString = "mongodb+srv://smoraga:Sm1994q@movierating.qpgpy.mongodb.net/?retryWrites=true&w=majority&appName=MovieRating"

func Connect() error {
	//CTX TIENE LAS OPCIONES DE LA CONEXIÓN
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	//INSTANCIA PARA CONECTAR A LA BASE DE DATOS
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cnString))
	if err != nil {
		log.Printf("error al conectar a la bd", strings.Split(err.Error(), ""))
		return err
	}
	MongoClient = client
	return nil
}

func GetInstanciaBd() *mongo.Client {
	return MongoClient
}
