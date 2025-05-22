package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Producto struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title           string             `bson:"title" json:"title"`
	Description     string             `bson:"description" json:"description"`
	LongDescription string             `bson:"longDescription" json:"longDescription"`
	Price           float64            `bson:"price" json:"price"`
	Categoria       string             `bson:"categoria" json:"categoria"`
	Phone           string             `bson:"phone" json:"phone"`
	StoreName       string             `bson:"storeName" json:"storeName"`
	StoreDNI        string             `bson:"storeDNI" json:"storeDNI"`
	StoreLogo       string             `bson:"storeLogo" json:"storeLogo"`
	FacebookLink    string             `bson:"facebookLink" json:"facebookLink"`
	InstagramLink   string             `bson:"instagramLink" json:"instagramLink"`
	Images          []string           `bson:"images" json:"images"`
}
