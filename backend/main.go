package main

import (
	"log"
	"net/http"

	"redrawn-api/pkg/handler"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	// Construct connection string using environment variables
	// connStr := fmt.Sprintf(
	// 	"user=%s dbname=%s password=%s sslmode=disable",
	// 	os.Getenv("DB_USER"),
	// 	os.Getenv("DB_NAME"),
	// 	os.Getenv("DB_PASSWORD"),
	// )

	// dbConn, err := sql.Open("postgres", connStr)
	// if err != nil {
	// 	log.Fatalf("Failed to connect to DB: %v", err)
	// }

	// queries := db.New(dbConn)
	r := chi.NewRouter()

	// Basic CORS setup
	corsConfig := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Replace with your frontend app's URL
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	r.Use(corsConfig.Handler)

	r.Route("/v1", func(r chi.Router) {
		r.Post("/scribble", handler.ScribbleHandler)
		// r.Post("/generate", handler.GenerateHandler)
	})

	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", r)
}
