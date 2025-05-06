# AZURE-CICD-Deployment-with-Github-Actions

## Save pass:


## Run from terminal:

docker build -t flasknextjsapp.azurecr.io/mltest:latest .

docker login flasknextjsapp.azurecr.io

docker push flasknextjsapp.azurecr.io/mltest:latest


## Deployment Steps:

1. Build the Docker image of the Source Code
2. Push the Docker image to Container Registry
3. Launch the Web App Server in Azure 
4. Pull the Docker image from the container registry to Web App server and run 

