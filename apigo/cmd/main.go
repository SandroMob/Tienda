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

	// Rutas públicas
	r.POST("/auth", controllers.Login)
	r.POST("/register", controllers.Register)

	protected := r.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		//END POINTS PRODUCTO
		protected.POST("/productos/:storeId/:userId", controllers.PostProducto)
		protected.PUT("/productos/:storeId/:productoId", controllers.PutProducto)
		protected.GET("/productos/:storeId", controllers.GetProductosPorTienda)

		//END POINTS TIENDA
		protected.POST("/tiendas/:userID", controllers.PostTienda)
		protected.PUT("/tiendas/:id", controllers.PutTienda)
		protected.GET("/tiendas/:userID", controllers.GetTiendasPorUsuario)

		//END POINTS USERS
		protected.POST("/users", controllers.EditarUsuario)
		protected.GET("/users/:id", controllers.GetUsuario)

		//END POINTS CATEGORIAS
		protected.GET("/categories", controllers.GetCategorias)

	}
	r.Run()
}
