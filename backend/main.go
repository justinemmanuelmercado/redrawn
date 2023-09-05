package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"encoding/base64"

	"github.com/justinemmanuelmercado/redrawn-api/backend/pkg/goreplicate"

	"github.com/go-chi/chi"
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
	r.Route("/v1", func(r chi.Router) {
		r.Get("/upload", uploadHandler)
	})

	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", r)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	model := goreplicate.NewModel("jagilley", "controlnet-scribble", "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117")
	// Read file

	imgData, err := os.ReadFile("fixture/test.png")
	if err != nil {
		log.Fatal("Error loading image: ", err)
	}

	encoded := base64.StdEncoding.EncodeToString(imgData)

	dataURI := "data:image/png;base64," + encoded

	model.Input = make(map[string]interface{})
	model.Input["prompt"] = "a photo of a brightly colored turtle"
	model.Input["image"] = dataURI
	model.Input["num_samples"] = 1
	model.Input["image_resolution"] = 512
	model.Input["ddim_steps"] = 20
	model.Input["scale"] = 9
	model.Input["eta"] = 0
	model.Input["a_prompt"] = "best quality, extremely detailed"
	model.Input["n_prompt"] = "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"

	fmt.Println(model.Input)

	token := "Token " + os.Getenv("REPLICATE_API_TOKEN")
	client := goreplicate.NewClient(token, model)

	err = client.Create()

	if err != nil {
		log.Printf("Error creating model: %v", err)
	}

	predictId := client.Response.ID
	log.Println(client.Response)

	err = client.Get(predictId)

	if err != nil {
		log.Printf("Error getting predictId: %v", err)
	}

	output := client.Response.Output
	log.Println(output)

	// return the predictId immediately
	w.Write([]byte(predictId))
	go func() { // create a new goroutine
		for {
			// Keep polling for client.Response.Output
			err := client.Get(predictId)
			if err != nil {
				log.Println("Error polling for output:", err)
				return
			}

			if client.Response.Output != nil {
				// Notify the client, perhaps by storing this in the DB or some message queue
				log.Println("Output:", client.Response.Output)
				break
			}

			time.Sleep(1 * time.Second) // Wait a bit before polling again
		}
	}()
}
