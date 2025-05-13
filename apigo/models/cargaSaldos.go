package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CargaSaldos struct {
	Fondo               string               `bson:"fondo"`
	Serie               string               `bson:"serie"`
	Run                 string               `bson:"run"`
	Fecha               primitive.DateTime   `bson:"fecha"`
	NroParticipes       int                  `bson:"nroParticipes"`
	NroParticipesIns    int                  `bson:"nroParticipesIns"`
	NroCuotasEmitidas   int                  `bson:"nroCuotasEmitidas"`
	NroCuotasPagadas    int                  `bson:"nroCuotasPagadas"`
	ValorCuotaEconomico primitive.Decimal128 `bson:"valorCuotaEconomico"`
	PatrimonioNeto      primitive.Decimal128 `bson:"patrimonioNeto"`
	ActivoTotal         primitive.Decimal128 `bson:"activoTotal"`
	ValorCuotaLibro     primitive.Decimal128 `bson:"valorCuotaLibro"`
	Id_Usuario          primitive.ObjectID   `bson:"id_usuario"`
	FechaCreacion       time.Time            `bson:"fechaCreacion"`
}
