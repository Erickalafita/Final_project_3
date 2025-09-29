#!/bin/bash

# GiftLink Deployment Script for IBM Cloud Code Engine
# This script deploys all services to IBM Cloud Code Engine

set -e

echo "================================"
echo "GiftLink IBM Cloud Deployment"
echo "================================"

# Configuration
PROJECT_NAME="giftlink-app"
REGION="us-south"  # Change to your preferred region
RESOURCE_GROUP="Default"  # Change to your resource group

# Check if IBM Cloud CLI is installed
if ! command -v ibmcloud &> /dev/null; then
    echo "Error: IBM Cloud CLI is not installed."
    echo "Please install from: https://cloud.ibm.com/docs/cli"
    exit 1
fi

# Check if Code Engine plugin is installed
if ! ibmcloud plugin list | grep -q "code-engine"; then
    echo "Installing Code Engine plugin..."
    ibmcloud plugin install code-engine
fi

echo ""
echo "Step 1: Login to IBM Cloud"
echo "----------------------------"
ibmcloud login --sso

echo ""
echo "Step 2: Target resource group and region"
echo "-----------------------------------------"
ibmcloud target -r $REGION -g $RESOURCE_GROUP

echo ""
echo "Step 3: Create Code Engine project"
echo "-----------------------------------"
# Check if project exists
if ibmcloud ce project get --name $PROJECT_NAME &> /dev/null; then
    echo "Project $PROJECT_NAME already exists. Selecting it..."
    ibmcloud ce project select --name $PROJECT_NAME
else
    echo "Creating new project: $PROJECT_NAME"
    ibmcloud ce project create --name $PROJECT_NAME
    ibmcloud ce project select --name $PROJECT_NAME
fi

echo ""
echo "Step 4: Create MongoDB instance"
echo "--------------------------------"
echo "Note: You need to set up MongoDB Atlas or IBM Cloud Databases for MongoDB"
echo "For MongoDB Atlas:"
echo "  1. Go to https://www.mongodb.com/cloud/atlas"
echo "  2. Create a free cluster"
echo "  3. Get connection string"
echo "  4. Update MONGO_URL secret below"
read -p "Press Enter when MongoDB is ready..."

echo ""
echo "Step 5: Create secrets for environment variables"
echo "-------------------------------------------------"
read -p "Enter MongoDB connection string: " MONGO_URL
read -p "Enter JWT Secret (or press Enter for default): " JWT_SECRET
JWT_SECRET=${JWT_SECRET:-"your_production_jwt_secret_$(date +%s)"}

ibmcloud ce secret create --name giftlink-secrets \
    --from-literal MONGO_URL="$MONGO_URL" \
    --from-literal JWT_SECRET="$JWT_SECRET" \
    || echo "Secret already exists, updating..."

echo ""
echo "Step 6: Build and deploy Sentiment Service"
echo "-------------------------------------------"
ibmcloud ce application create \
    --name sentiment-service \
    --build-source ./sentiment \
    --strategy dockerfile \
    --port 3000 \
    --min-scale 1 \
    --max-scale 2 \
    --cpu 0.25 \
    --memory 0.5G \
    || ibmcloud ce application update \
    --name sentiment-service \
    --build-source ./sentiment \
    --strategy dockerfile

# Get sentiment service URL
SENTIMENT_URL=$(ibmcloud ce app get --name sentiment-service -o url)
echo "Sentiment Service URL: $SENTIMENT_URL"

echo ""
echo "Step 7: Build and deploy Backend API"
echo "-------------------------------------"
ibmcloud ce application create \
    --name backend-api \
    --build-source ./giftlink-backend \
    --strategy dockerfile \
    --port 3060 \
    --min-scale 1 \
    --max-scale 3 \
    --cpu 0.5 \
    --memory 1G \
    --env-from-secret giftlink-secrets \
    --env SENTIMENT_URL="$SENTIMENT_URL" \
    || ibmcloud ce application update \
    --name backend-api \
    --build-source ./giftlink-backend \
    --strategy dockerfile \
    --env-from-secret giftlink-secrets \
    --env SENTIMENT_URL="$SENTIMENT_URL"

# Get backend URL
BACKEND_URL=$(ibmcloud ce app get --name backend-api -o url)
echo "Backend API URL: $BACKEND_URL"

echo ""
echo "Step 8: Build and deploy Frontend"
echo "----------------------------------"
# Update frontend .env with backend URL
echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > ./giftlink-frontend/.env.production

ibmcloud ce application create \
    --name frontend \
    --build-source ./giftlink-frontend \
    --strategy dockerfile \
    --port 80 \
    --min-scale 1 \
    --max-scale 3 \
    --cpu 0.25 \
    --memory 0.5G \
    --env REACT_APP_BACKEND_URL="$BACKEND_URL" \
    || ibmcloud ce application update \
    --name frontend \
    --build-source ./giftlink-frontend \
    --strategy dockerfile \
    --env REACT_APP_BACKEND_URL="$BACKEND_URL"

# Get frontend URL
FRONTEND_URL=$(ibmcloud ce app get --name frontend -o url)

echo ""
echo "================================"
echo "Deployment Complete!"
echo "================================"
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo "Sentiment URL: $SENTIMENT_URL"
echo ""
echo "Next steps:"
echo "1. Visit $FRONTEND_URL to access your application"
echo "2. Import sample data (see documentation)"
echo "3. Configure custom domain (optional)"
echo ""
echo "To view logs:"
echo "  ibmcloud ce app logs --name frontend"
echo "  ibmcloud ce app logs --name backend-api"
echo "  ibmcloud ce app logs --name sentiment-service"
echo ""
echo "To delete deployment:"
echo "  ibmcloud ce project delete --name $PROJECT_NAME"