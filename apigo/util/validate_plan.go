package util

import (
	"errors"
	"go-api/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// A esta función pienso preguntarle si el usuario puede agregar más elementos al sitio según el plan que tiene.
// En este caso lo está haciendo para crear productos y para crear tiendas.
func ValidatePlan(userId primitive.ObjectID, accion int, storeId primitive.ObjectID) (bool, error) {
	// Obtener el plan del usuario
	plan, err := GetPlanDetalis(userId)
	if err != nil {
		return false, err
	}

	// Validar la acción según el plan
	switch accion {
	case 1: // Validar la cantidad de tiendas del plan contra las que tiene creadas
		if plan.MaxStores <= models.GetCantidadTiendasByUserID(userId) {
			return false, errors.New("el plan no permite crear tiendas")
		}
	case 2: // Validar si puede crear productos
		if plan.MaxPublicationsPerStore <= models.GetCantidadProductosStoreId(storeId) {
			return false, errors.New("el plan no permite crear productos")
		}
	default:
		return false, errors.New("acción no válida")
	}

	return true, nil
}

func GetPlanDetalis(userId primitive.ObjectID) (*models.ServicePlans, error) {
	usuario, err := models.GetUsuarioById(userId)
	if err != nil {
		return nil, err
	}
	//muestro los datos obtenidos por consola

	// Obtener el plan del usuario
	plan, err := models.GetPlanById(usuario.PlanID)
	if err != nil {
		return nil, err
	}
	return plan, nil
}
