# User Registration Server

A Node.js/Express server for user registration with MongoDB integration.

## Features

- User registration with validation
- Password hashing with bcrypt
- MongoDB database integration
- CORS enabled for frontend integration
- Error handling and validation
- RESTful API endpoints

## API Endpoints

### POST /api/register
Register a new user

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/health
Health check endpoint

### GET /api/users
Get all users (for testing purposes)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://varvarakovbasyuk:QWRyHEOdFokxvduX@cluster0.hjrtfev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

## Database Schema

The User model includes:
- firstName (required)
- lastName (required)
- email (required, unique)
- password (required, min 6 characters)
- phone (required)
- dateOfBirth (required)
- createdAt (auto-generated)

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- CORS protection
- Error handling without exposing sensitive information 