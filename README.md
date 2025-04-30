# Mythos - RPG Quest Application

A modern, gamified task management and quest system built with React, Node.js, and MongoDB. This application transforms mundane tasks into exciting quests, complete with experience points, progress tracking, and real-time updates.

## 🎮 Features

### User Authentication

- **Secure Authentication System**
  - JWT-based authentication with secure token storage
  - Password strength validation with real-time feedback
  - Email and password validation with accessibility support
  - Terms of service acceptance with checkbox validation
  - Secure cookie handling with httpOnly and sameSite policies

### Gamified Task Management

- **Quest System**
  - Create and manage quests with customisable XP rewards
  - Track task completion with real-time updates
  - Experience points (XP) system with level progression
  - Progress visualisation using D3.js charts
  - Auto-sliding carousel for active quests
  - Quest filtering and sorting capabilities

### Visual Analytics

- **Interactive Dashboards**
  - Progress donut charts with dual-layer visualisation
  - Player progression graphs with historical data
  - Streak tracking with animated gauges
  - Task completion statistics with pie charts
  - Customisable card layouts with accessibility support
  - Responsive design for all screen sizes

### Real-time Updates

- **Socket.IO Integration**
  - Live progress updates across all connected clients
  - Instant notifications for quest completions
  - Real-time XP updates
  - Synchronised state management
  - Automatic reconnection handling

### Accessibility

- **WCAG 2.1 Compliance**
  - Keyboard navigation with focus management
  - Screen reader support with ARIA labels
  - Skip links for main content
  - Focus trapping in modals
  - Color contrast compliance
  - Form validation announcements
  - Loading state announcements

## 🛠️ Tech Stack

### Frontend

- **React with TypeScript**
  - Functional components with hooks
  - Context API for state management
  - Custom hooks for reusable logic
  - Type-safe props and state management

- **UI Libraries**
  - Framer Motion for smooth animations
  - D3.js for interactive data visualisation
  - Tailwind CSS for responsive styling
  - Socket.IO client for real-time updates

### Backend

- **Node.js with Express**
  - RESTful API architecture
  - MVC pattern implementation
  - Middleware for authentication and validation
  - Error handling middleware

- **Database & Authentication**
  - MongoDB for flexible data storage
  - Mongoose for schema validation
  - JWT for secure authentication
  - bcrypt for password hashing

- **Real-time Communication**
  - Socket.IO for bidirectional communication
  - Event-based architecture
  - Room-based messaging
  - Authentication middleware for sockets

### Infrastructure

- **Containerisation**
  - Docker for consistent environments
  - Multi-stage builds for optimisation
  - Nginx for static file serving
  - Environment-based configuration

- **Security**
  - Helmet.js for HTTP security headers
  - CORS configuration for cross-origin requests
  - X-Frame-Options for clickjacking protection
  - X-Content-Type-Options for MIME type sniffing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mythos.git
cd mythos
```

2. Set up environment variables:

```bash
# Create .env file in root directory
cp .env.example .env
# Edit .env with your configuration
```

3. Start the application:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: <http://localhost:80>
- Backend API: <http://localhost:3000>
- MongoDB: mongodb://localhost:27017

## 📦 Project Structure

```
mythos/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components
│   │   │   ├── graphs/    # Data visualisation components
│   │   │   └── auth/      # Authentication components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Application pages
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main application component
│   └── Dockerfile         # Frontend container configuration
│
├── backend/               # Node.js backend application
│   ├── controllers/       # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Express middlewares
│   └── index.js           # Server entry point
│
└── docker-compose.yml     # Docker configuration
```

## 🔒 Security Features

- **Authentication & Authorisation**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt
  - Session management
  - Token refresh mechanism

- **HTTP Security**
  - Helmet.js for security headers
  - CORS configuration
  - X-Frame-Options protection
  - X-Content-Type-Options prevention
  - Secure cookie handling

- **Data Protection**
  - Input validation
  - Output sanitisation
  - Rate limiting
  - SQL injection prevention
  - XSS protection

## 📊 API Documentation

The API documentation is available at `/api-docs` when running the backend server. It includes:

- **Authentication Endpoints**
  - User registration
  - User login
  - Password reset
  - Token refresh

- **Quest Management**
  - Create quests
  - Update quests
  - Delete quests
  - List quests
  - Quest completion

- **Task Management**
  - Create tasks
  - Update tasks
  - Delete tasks
  - Task completion
  - Task progress

- **Real-time Endpoints**
  - Socket.IO events
  - Room management
  - Message broadcasting
  - Status updates

## 🧪 Testing

The application includes comprehensive testing:

- **Frontend Testing**
  - Component testing with React Testing Library
  - Accessibility testing with axe-core
  - Performance testing
  - Visual regression testing

- **Backend Testing**
  - API endpoint testing
  - Database integration testing
  - Socket.IO event testing
  - Authentication testing

To run tests:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
1. Create your feature branch (`git checkout -b feature/amazing-feature`)
1. Commit your changes (`git commit -m 'Add some amazing feature'`)
1. Push to the branch (`git push origin feature/amazing-feature`)
1. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI integration
- MongoDB for database support
- The React and Node.js communities
- All contributors to the project
