package main

import (
	cbd "go-api/coneccion"
	"go-api/controllers"
	"go-api/middleware"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := cbd.Connect(); err != nil {
		log.Fatal("Error al conectar con la base de datos:", err)
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1", "http://69.62.95.90"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.POST("/auth", controllers.Login)
	protected := r.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.GET("/empresas", controllers.GetEmpresas)
		protected.GET("/tiendas/:userID", controllers.GetTiendasPorUsuario)
		protected.POST("/empresas/:id", controllers.PatchEmpresa)
		protected.POST("/users", controllers.EditarUsuario)
		protected.GET("/users/:id", controllers.GetUsuario)
	}
	r.Run()
}
