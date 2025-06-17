package models

import (
	"context"
	"crypto/sha256"
	"fmt"
	cbd "go-api/coneccion"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Usuario struct {
	ID            string             `bson:"_id,omitempty" json:"_id"`
	Nombre        string             `bson:"nombre" json:"nombre"`
	Apellido      string             `bson:"apellido" json:"apellido"`
	Email         string             `bson:"email" json:"email"`
	Pass          string             `bson:"pass" json:"-"`
	FechaCreacion time.Time          `bson:"fecha_creacion" json:"fecha_creacion"`
	PlanID        primitive.ObjectID `bson:"plan_id" json:"plan_id"`
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

func CreateUsuario(usuario Usuario) (*Usuario, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("user")

	// Si no se pasa un planId explícito, asignar el plan FREE por defecto
	if usuario.PlanID == primitive.NilObjectID {
		//Agrego el id del plan como objectID
		planID, _ := primitive.ObjectIDFromHex("684a40ac01ddc82fa3f580b2") // ID del plan gratuito
		usuario.PlanID = planID
	}

	usuario.Pass = string(Encrypt(usuario.Pass)) // Encriptar la contraseña
	// Insertar el usuario en la colección
	result, err := collection.InsertOne(context.TODO(), usuario)
	if err != nil {
		return nil, err
	}
	// Asignar el ID generado al usuario
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		usuario.ID = oid.Hex()
	}
	// Retornar el usuario creado
	return &usuario, nil
}

func Encrypt(password string) string {
	hash := sha256.Sum256([]byte(password))
	return fmt.Sprintf("%x", hash[:])
}
