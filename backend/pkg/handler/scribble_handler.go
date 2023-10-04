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

type Response struct {
	PredictId string      `json:"predictId"`
	Data      interface{} `json:"data"`
	Result    interface{} `json:"result"`
}

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

	client, err := replicate.NewClient(replicate.WithTokenFromEnv())
	if err != nil {
		log.Printf("Error creating client: %v", err)
		return
	}

	input := replicate.PredictionInput{
		"prompt":                 prompt,
		"image":                  dataURI,
		"num_samples":            "1",
		"condition_scale":        0.5,
		"structure":              "scribble",
		"image_resolution":       512,
		"steps":                  20,
		"eta":                    0,
		"negative_prompt":        "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
		"return_reference_image": true,
	}

	prediction, err := client.CreatePrediction(context.TODO(), "795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477", input, nil, false)
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
			response := Response{
				PredictId: predictId,
				Data:      prediction.Output,
			}

			switch data := prediction.Output.(type) {
			case []interface{}:
				if (len(data)) >= 2 {
					response.Result = data[1]
				}
			default:
				log.Printf("Unexpected type %T\n", data)
			}

			responseJSON, err := json.Marshal(response)
			if err != nil {
				log.Println("Error marshalling prediction output:", err)
				return
			}
			log.Println("Output:", prediction.Output)

			w.Header().Set("Content-Type", "application/json")
			w.Write(responseJSON)

			break
		}

		time.Sleep(1 * time.Second)
	}
}
