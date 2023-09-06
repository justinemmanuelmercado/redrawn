package handler

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/replicate/replicate-go"
)

func ScribbleHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("ScribbleHandler called")
	r.ParseMultipartForm(10 << 20) // max memory limit
	file, _, err := r.FormFile("image")
	if err != nil {
		log.Printf("Error getting image: %v", err)
		return
	}
	defer file.Close()

	imgData, err := io.ReadAll(file)
	if err != nil {
		log.Printf("Error reading image: %v", err)
		return
	}

	encoded := base64.StdEncoding.EncodeToString(imgData)
	dataURI := "data:image/png;base64," + encoded
	prompt := r.FormValue("prompt")

	// Placeholder for Theme-based settings. You can expand this later.

	client, err := replicate.NewClient(replicate.WithTokenFromEnv())
	if err != nil {
		log.Printf("Error creating client: %v", err)
		return
	}

	input := replicate.PredictionInput{
		"prompt":           prompt,
		"image":            dataURI,
		"num_samples":      "1",
		"image_resolution": "512",
		"ddim_steps":       20,
		"scale":            9,
		"eta":              0,
		"a_prompt":         "best quality, cyberpunk",
		"n_prompt":         "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
	}

	prediction, err := client.CreatePrediction(context.TODO(), "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117", input, nil, false)
	if err != nil {
		log.Printf("Error creating prediction: %v", err)
		return
	}

	predictId := prediction.ID
	log.Println("PredictId:", predictId)

	for {
		prediction, err := client.GetPrediction(context.TODO(), predictId)
		if err != nil {
			log.Println("Error polling for output:", err)
			return
		}

		if prediction.Output != nil {
			jsonData, err := json.Marshal(prediction.Output)
			if err != nil {
				log.Println("Error marshalling prediction output:", err)
				return
			}
			log.Println("Output:", prediction.Output)

			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(predictId))
			w.Write([]byte(jsonData))

			break
		}

		time.Sleep(1 * time.Second)
	}
}
