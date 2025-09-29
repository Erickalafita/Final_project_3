# GiftLink Docker Setup

This guide explains how to run the GiftLink application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Services

The application consists of 4 services:

1. **MongoDB** (Port 27017) - Database
2. **Sentiment Service** (Port 3000) - Sentiment analysis microservice
3. **Backend API** (Port 3060) - Express.js backend
4. **Frontend** (Port 80) - React frontend with Nginx

## Quick Start

### Build and Start All Services

```bash
docker-compose up --build
```

This will:
- Build all Docker images
- Start all containers
- Create a network for inter-service communication
- Create a persistent volume for MongoDB data

### Start Services in Background

```bash
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Reset)

```bash
docker-compose down -v
```

## Accessing the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3060
- **Sentiment Service**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

## Importing Sample Data

After starting the services, import sample gift data:

```bash
docker exec -it giftlink-backend node /app/util/import-mongo/index.js
```

## Viewing Logs

### All services
```bash
docker-compose logs -f
```

### Specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sentiment
docker-compose logs -f mongodb
```

## Rebuilding a Specific Service

```bash
docker-compose up --build backend
docker-compose up --build frontend
docker-compose up --build sentiment
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors, stop the local services:
- Stop local Node.js servers
- Stop local MongoDB
- Or change ports in docker-compose.yml

### MongoDB Connection Issues

Make sure MongoDB container is healthy:
```bash
docker ps
docker logs giftlink-mongodb
```

### Frontend Can't Connect to Backend

Check that REACT_APP_BACKEND_URL in docker-compose.yml matches your backend URL.

### Reset Everything

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development

For development, you may want to use volumes to enable hot-reload:

```yaml
backend:
  volumes:
    - ./giftlink-backend:/app
    - /app/node_modules
```

## Production Deployment

For production:
1. Change JWT_SECRET in docker-compose.yml
2. Use environment-specific .env files
3. Configure MongoDB authentication
4. Use a managed MongoDB service (MongoDB Atlas)
5. Set up SSL/TLS for nginx
6. Configure proper CORS settings