echo "Getting environment variables from deploy.env file"

if [ -f deploy.env ]
then
  export $(cat deploy.env | xargs)
else
  echo "File deploy.env not found"
  exit
fi

echo "Building process started"

# Log in IBM Cloud
ibmcloud login --apikey ${APIKEY}

# Log in IBM private container registry
ibmcloud cr login

# List all resource groups available to your selected account
ibmcloud resource groups

# Get the desired resource group name
echo "What is the name of the target Resource Group?"
read resource_group

# Set the target resource group
ibmcloud target -g $resource_group

# Create the registry repo string
REGISTRY_REPOSITORY="${CR_SERVER}/${CR_NAMESPACE}/${CR_IMAGE_NAME}"
echo "Container registry repository: ${REGISTRY_REPOSITORY}"

# Build docker image
docker build --no-cache -t $REGISTRY_REPOSITORY .

# Push it to container registry
docker push $REGISTRY_REPOSITORY

echo "Build completed"

# Set the project
ibmcloud ce project select -n $CE_PROJECT

# Create secret
ibmcloud ce secret update -n $CE_SECRET_NAME --from-env-file .env
if [ $? -eq 0 ]; 
then
  echo "Secret $CE_SECRET_NAME updated"
else
  ibmcloud ce secret create -n $CE_SECRET_NAME --from-env-file .env
  echo "Secret $CE_SECRET_NAME created"
fi

# Create application
ibmcloud ce application update --name $CE_APP_NAME --env-from-secret $CE_SECRET_NAME --image "${REGISTRY_REPOSITORY}:latest" --registry-secret $CE_REGISTRY_SECRET_NAME --min-scale=1 --max-scale=1
if [ $? -eq 0 ]; 
then
  echo "Application updated"
else
  ibmcloud ce application create --name $CE_APP_NAME --env-from-secret $CE_SECRET_NAME --image "${REGISTRY_REPOSITORY}:latest" --registry-secret $CE_REGISTRY_SECRET_NAME --min-scale=1 --max-scale=1
  echo "Application created"
fi

ibmcloud ce application get --name $CE_APP_NAME