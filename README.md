# 🎁 GiftLink - Household Items Exchange Platform

GiftLink is a full-stack web application that connects users who want to give away household items with those looking for free items. Built with React, Node.js, Express, and MongoDB, featuring sentiment analysis on user comments.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- 🏠 **Browse Gifts** - View available household items
- 🔍 **Advanced Search** - Filter by name, category, condition, and age
- 👤 **User Authentication** - Secure JWT-based login/registration
- 💬 **Comments System** - Leave comments on gift listings
- 😊 **Sentiment Analysis** - Automatic sentiment detection on comments
- 📱 **Responsive Design** - Mobile-friendly Bootstrap UI
- 👥 **User Profiles** - Manage your account information

### Technical Features
- 🔐 Secure password hashing with bcrypt
- 🎯 RESTful API architecture
- 📊 Real-time sentiment analysis using Natural library
- 🐳 Fully containerized with Docker
- ☁️ Cloud-ready deployment configurations
- 🔄 CI/CD pipeline with GitHub Actions

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React     │────▶│   Express    │────▶│   MongoDB   │
│  Frontend   │     │   Backend    │     │   Database  │
│  (Port 80)  │     │  (Port 3060) │     │ (Port 27017)│
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Sentiment  │
                    │   Service   │
                    │ (Port 3000) │
                    └─────────────┘
```

### Directory Structure

```
Final_project_3/
├── giftlink-frontend/      # React frontend application
├── giftlink-backend/       # Express.js backend API
├── sentiment/              # Sentiment analysis microservice
├── k8s/                    # Kubernetes manifests
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Docker orchestration
└── README.md               # This file
```

## 🛠️ Technologies

### Frontend
- **React** 18 - UI framework
- **React Router** - Client-side routing
- **Bootstrap** 5 - UI components
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Natural** - NLP sentiment analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD
- **Kubernetes** - Container orchestration
- **IBM Cloud Code Engine** - Serverless deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Erickalafita/Final_project_3.git
   cd Final_project_3
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd giftlink-backend
   npm install

   # Frontend
   cd ../giftlink-frontend
   npm install

   # Sentiment service
   cd ../sentiment
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend (.env)
   cd giftlink-backend
   cp .env.sample .env
   # Edit .env with your MongoDB URL and JWT secret

   # Frontend (.env)
   cd ../giftlink-frontend
   echo "REACT_APP_BACKEND_URL=http://localhost:3060" > .env
   ```

4. **Import sample data**
   ```bash
   cd giftlink-backend/util/import-mongo
   node index.js
   ```

5. **Start all services**
   ```bash
   # Terminal 1 - Backend
   cd giftlink-backend
   npm start

   # Terminal 2 - Frontend
   cd giftlink-frontend
   npm start

   # Terminal 3 - Sentiment Service
   cd sentiment
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3060
   - Sentiment: http://localhost:3000

### Docker Deployment

See [DOCKER.md](./DOCKER.md) for detailed instructions.

```bash
# Quick start
docker-compose up --build

# Access at http://localhost
```

## ☁️ Deployment

### IBM Cloud Code Engine

See [IBM_CLOUD_DEPLOYMENT.md](./IBM_CLOUD_DEPLOYMENT.md) for detailed instructions.

```bash
# Automated deployment
./deploy-ibm-cloud.sh
```

### Kubernetes

See [k8s/](./k8s/) directory for Kubernetes manifests.

```bash
kubectl apply -f k8s/
```

### CI/CD Pipeline

GitHub Actions automatically deploys to IBM Cloud on push to `main` branch.

**Required Secrets:**
- `IBM_CLOUD_API_KEY`
- `MONGO_URL`
- `JWT_SECRET`

See [.github/workflows/README.md](./.github/workflows/README.md) for setup instructions.

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Update Profile
```http
PUT /api/auth/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith"
}
```

### Gifts

#### Get All Gifts
```http
GET /api/gifts
```

#### Get Gift by ID
```http
GET /api/gifts/:id
```

#### Search Gifts
```http
GET /api/search?name=lamp&category=Kitchen&condition=New&age_years=5
```

### Comments

#### Get Comments for Gift
```http
GET /api/comments/:giftId
```

#### Add Comment
```http
POST /api/comments
Content-Type: application/json

{
  "giftId": "875",
  "author": "John Doe",
  "comment": "This looks great!"
}
```

### Sentiment Analysis

#### Analyze Text
```http
POST /sentiment
Content-Type: application/json

{
  "sentence": "This is an amazing product!"
}
```

## 🧪 Testing

```bash
# Run backend tests
cd giftlink-backend
npm test

# Run frontend tests
cd giftlink-frontend
npm test
```

## 📊 Project Management

User stories and project tracking available in:
- [USER_STORIES.md](./USER_STORIES.md)
- GitHub Issues
- GitHub Projects board

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of an IBM Full-Stack Developer Capstone Project.

## 👥 Authors

- **Erick Alafita** - [GitHub](https://github.com/Erickalafita)

## 🙏 Acknowledgments

- IBM Skills Network for the project template
- Natural library for sentiment analysis
- MongoDB Atlas for database hosting
- IBM Cloud for deployment platform

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting guides

---

**Built with ❤️ using the MERN stack**