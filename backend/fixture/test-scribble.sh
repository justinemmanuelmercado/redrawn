#!/bin/bash

# Set your API endpoint
API_ENDPOINT="http://localhost:8080/v1/scribble"

# Path to the image you want to upload
IMAGE_PATH="./test.png"

# The prompt you want to use
PROMPT="a photo of a turtle"

# Some random theme, you can change this to whatever you want
THEME="random_theme_here"

# Use curl to send a POST request with form-data
curl -X POST -F "image=@${IMAGE_PATH}" -F "prompt=${PROMPT}" -F "theme=${THEME}" ${API_ENDPOINT}
