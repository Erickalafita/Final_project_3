# IBM Cloud Deployment Guide

This guide explains how to deploy the GiftLink application to IBM Cloud.

## Deployment Options

### Option 1: IBM Cloud Code Engine (Recommended)
Code Engine is a fully managed, serverless platform that runs containerized workloads.

### Option 2: IBM Cloud Kubernetes Service (IKS)
Full Kubernetes cluster for more control and customization.

---

## Prerequisites

1. **IBM Cloud Account**
   - Sign up at https://cloud.ibm.com
   - Free tier available

2. **IBM Cloud CLI**
   ```bash
   # macOS
   curl -fsSL https://clis.cloud.ibm.com/install/osx | sh

   # Linux
   curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

   # Windows
   # Download from https://cloud.ibm.com/docs/cli
   ```

3. **Code Engine Plugin**
   ```bash
   ibmcloud plugin install code-engine
   ```

4. **MongoDB Database**
   - Option A: MongoDB Atlas (recommended)
     - Free tier: https://www.mongodb.com/cloud/atlas
   - Option B: IBM Cloud Databases for MongoDB
     - Paid service with automatic backups

---

## Option 1: Deploy with Code Engine (Automated)

### Step 1: Prepare MongoDB

**Using MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for Code Engine
5. Get connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/giftdb`)

### Step 2: Run Deployment Script

```bash
chmod +x deploy-ibm-cloud.sh
./deploy-ibm-cloud.sh
```

The script will:
- Login to IBM Cloud
- Create Code Engine project
- Deploy all three services
- Configure environment variables
- Provide application URLs

### Step 3: Import Sample Data

After deployment, import sample gift data:

```bash
# Get backend app name
ibmcloud ce app list

# Run import job
ibmcloud ce job create \
  --name import-data \
  --image giftlink-backend:latest \
  --command node \
  --argument /app/util/import-mongo/index.js \
  --env-from-secret giftlink-secrets

ibmcloud ce jobrun submit --job import-data
```

---

## Option 2: Deploy with Kubernetes

### Step 1: Create Kubernetes Cluster

```bash
# Create cluster (takes ~20 minutes)
ibmcloud ks cluster create classic \
  --name giftlink-cluster \
  --zone dal10 \
  --machine-type b3c.4x16 \
  --workers 3

# Get cluster config
ibmcloud ks cluster config --cluster giftlink-cluster
```

### Step 2: Build and Push Images

```bash
# Login to IBM Cloud Container Registry
ibmcloud cr login

# Create namespace
ibmcloud cr namespace-add giftlink

# Build and push images
docker build -t us.icr.io/giftlink/backend:latest ./giftlink-backend
docker build -t us.icr.io/giftlink/frontend:latest ./giftlink-frontend
docker build -t us.icr.io/giftlink/sentiment:latest ./sentiment

docker push us.icr.io/giftlink/backend:latest
docker push us.icr.io/giftlink/frontend:latest
docker push us.icr.io/giftlink/sentiment:latest
```

### Step 3: Update Kubernetes Manifests

Edit `k8s/*.yaml` files and replace image names:
```yaml
image: us.icr.io/giftlink/backend:latest
```

### Step 4: Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace giftlink

# Update secrets with your values
kubectl create secret generic giftlink-secrets \
  --from-literal=MONGO_URL='your_mongodb_connection_string' \
  --from-literal=JWT_SECRET='your_jwt_secret' \
  --from-literal=SENTIMENT_URL='http://sentiment-service:3000' \
  -n giftlink

# Deploy all services
kubectl apply -f k8s/ -n giftlink

# Get service URLs
kubectl get services -n giftlink
```

---

## Monitoring and Logs

### Code Engine

```bash
# View applications
ibmcloud ce app list

# View logs
ibmcloud ce app logs --name frontend
ibmcloud ce app logs --name backend-api
ibmcloud ce app logs --name sentiment-service

# View app details
ibmcloud ce app get --name frontend
```

### Kubernetes

```bash
# Get pods
kubectl get pods -n giftlink

# View logs
kubectl logs -f deployment/frontend -n giftlink
kubectl logs -f deployment/backend-api -n giftlink
kubectl logs -f deployment/sentiment-service -n giftlink

# Get service info
kubectl describe service frontend -n giftlink
```

---

## Scaling

### Code Engine (Auto-scaling)

```bash
# Update scaling configuration
ibmcloud ce app update --name backend-api \
  --min-scale 1 \
  --max-scale 10 \
  --cpu 1 \
  --memory 2G
```

### Kubernetes

```bash
# Manual scaling
kubectl scale deployment backend-api --replicas=5 -n giftlink

# Auto-scaling (HPA)
kubectl autoscale deployment backend-api \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n giftlink
```

---

## Custom Domain

### Code Engine

```bash
# Create custom domain mapping
ibmcloud ce app update --name frontend \
  --domain giftlink.yourdomain.com
```

### Kubernetes

```bash
# Install ingress controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install nginx-ingress ingress-nginx/ingress-nginx

# Create ingress
kubectl apply -f k8s/ingress.yaml
```

---

## Environment Variables

### Production Secrets

Update these in IBM Cloud:

1. **MONGO_URL**: MongoDB connection string
2. **JWT_SECRET**: Strong random string for JWT signing
3. **SENTIMENT_URL**: Sentiment service URL

### Code Engine

```bash
ibmcloud ce secret update --name giftlink-secrets \
  --from-literal JWT_SECRET='new_secret_value'
```

### Kubernetes

```bash
kubectl create secret generic giftlink-secrets \
  --from-literal=JWT_SECRET='new_secret_value' \
  --dry-run=client -o yaml | kubectl apply -f - -n giftlink
```

---

## Cost Estimation

### Code Engine (Free Tier Available)
- **Free tier**: 100,000 vCPU-seconds/month, 200,000 GiB-seconds/month
- **Cost**: Pay only for resources used
- **Estimate**: $0-20/month for low traffic

### Kubernetes Service
- **Small cluster**: ~$100/month
- **Medium cluster**: ~$300/month
- **Large cluster**: $500+/month

### MongoDB Atlas
- **Free tier (M0)**: $0/month, 512 MB storage
- **Shared (M2)**: $9/month, 2 GB storage
- **Dedicated (M10)**: $57/month, 10 GB storage

---

## Troubleshooting

### Application Not Starting

```bash
# Check logs
ibmcloud ce app logs --name backend-api --tail 100

# Check configuration
ibmcloud ce app get --name backend-api
```

### Database Connection Issues

1. Check MongoDB connection string format
2. Verify network access (whitelist 0.0.0.0/0 for Code Engine)
3. Test connection from local machine
4. Check secret values

### Build Failures

```bash
# Check build logs
ibmcloud ce build logs --name backend-api

# Rebuild
ibmcloud ce app update --name backend-api --rebuild
```

---

## Cleanup

### Delete Code Engine Project

```bash
ibmcloud ce project delete --name giftlink-app
```

### Delete Kubernetes Cluster

```bash
ibmcloud ks cluster rm --cluster giftlink-cluster --force-delete-storage
```

---

## CI/CD with GitHub Actions

See `.github/workflows/deploy.yml` for automated deployment pipeline.

## Security Best Practices

1. **Use secrets for sensitive data**
2. **Enable HTTPS/TLS**
3. **Implement rate limiting**
4. **Use MongoDB authentication**
5. **Regular security updates**
6. **Monitor application logs**

---

## Support

- IBM Cloud Docs: https://cloud.ibm.com/docs
- Code Engine: https://cloud.ibm.com/docs/codeengine
- Kubernetes Service: https://cloud.ibm.com/docs/containers

For issues, create a ticket in IBM Cloud Support.