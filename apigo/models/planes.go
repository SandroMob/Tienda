package models

import (
	"context"
	cbd "go-api/coneccion"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ServicePlans struct {
	ID                      primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name                    string             `bson:"name" json:"name"`
	MaxStores               int                `bson:"max_stores" json:"max_stores"`
	MaxPublicationsPerStore int                `bson:"max_publications_per_store" json:"max_publications_per_store"`
	MaxImagesPerPublication int                `bson:"max_images_per_publication" json:"max_images_per_publication"`
}

func GetPlanById(planID primitive.ObjectID) (*ServicePlans, error) {
	client := cbd.GetInstanciaBd()
	collection := client.Database("Mercado").Collection("service_plans")
	filter := bson.M{"_id": planID}
	var plan ServicePlans
	err := collection.FindOne(context.TODO(), filter).Decode(&plan)
	if err == mongo.ErrNoDocuments {
		return nil, err
	}
	return &plan, err
}
