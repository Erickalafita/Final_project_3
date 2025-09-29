# GitHub Actions CI/CD Setup

## Prerequisites

To enable automated deployment to IBM Cloud, you need to configure the following secrets in your GitHub repository:

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Required Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `IBM_CLOUD_API_KEY` | IBM Cloud API Key | [Create API Key](https://cloud.ibm.com/iam/apikeys) |
| `MONGO_URL` | MongoDB connection string | MongoDB Atlas or IBM Cloud Databases |
| `JWT_SECRET` | Secret for JWT signing | Generate strong random string |

### Creating IBM Cloud API Key

```bash
# Login to IBM Cloud
ibmcloud login --sso

# Create API key
ibmcloud iam api-key-create giftlink-deploy-key \
  --description "API key for GitHub Actions deployment" \
  --file ./apikey.json

# Copy the apikey value to GitHub Secrets
cat apikey.json
```

### Workflow Trigger

The deployment workflow runs:
- **Automatically** on push to `main` branch
- **Manually** via GitHub Actions UI (workflow_dispatch)

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy to IBM Cloud Code Engine**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Monitoring Deployment

- View deployment progress in **Actions** tab
- Check deployment summary for application URLs
- Monitor logs in IBM Cloud console

### Customization

Edit `.github/workflows/deploy.yml` to:
- Change deployment regions
- Adjust resource limits
- Add additional deployment steps
- Configure different environments (staging/production)