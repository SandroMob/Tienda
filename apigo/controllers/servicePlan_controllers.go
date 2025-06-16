package controllers

import (
	"fmt"
	util "go-api/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func PlanDetails(c *gin.Context) {

	userId := c.Param("id")

	idfinal, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id usuario no válido"})
		return
	}

	planDetails, err := util.GetPlanDetalis(idfinal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener los detalles del plan"})
		return
	}

	if planDetails == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Plan no encontrado"})
		return
	}
	fmt.Println("Detalles del plan:", planDetails)
	c.JSON(http.StatusOK, gin.H{"plan": planDetails})
}
