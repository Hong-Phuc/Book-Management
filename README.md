# Library Management - MERN Stack Application

A full-featured library management application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## Key Features

- Book management (add, edit, delete, search)
- User management with role-based access control
- Modern, responsive user interface using React and Tailwind CSS
- RESTful API backend
- MongoDB database integration
- Real-time notifications with Notistack

## Technologies Used

### Frontend
- React.js – JavaScript framework for building user interfaces
- Vite – Fast build tool and development server
- React Router DOM – Client-side routing
- Axios – HTTP client for API calls
- Tailwind CSS – Utility-first CSS framework
- React Icons – Icon library for React
- Notistack – Notification system for React

### Backend
- Node.js - JavaScript runtime environment
- Express.js – Web application framework
- MongoDB – NoSQL database
- Mongoose – MongoDB object modeling tool
- CORS – Security middleware for cross-origin requests

## System Requirements
- Node.js ((version 14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Configuration

1. Create a .env file in the backend folder with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5555
```

2. Create a .env file in the frontend folder with the following variable:
```
VITE_API_URL=http://localhost:5555
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will run at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5555

## Project Structure

```
Book-Management/
├── frontend/           # React frontend app
│   ├── src/            # Source code
│   ├── public/         # Static files
│   └── package.json    # Frontend dependencies
├── backend/            # Node.js backend app
│   ├── models/         # MongoDB models
│   ├── routes/         # API route definitions
│   ├── controllers/    # Business logic and controllers
│   └── package.json    # Backend dependencies
└── README.md
```

## Scripts

### Backend
- npm run dev: Start the development server using nodemon
- npm start: Start the production server

### Frontend
- npm run dev: Start the development server
- npm run build: Build the app for production
- npm run preview: Preview the production build
- npm run lint: Run ESLint for code quality
