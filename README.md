# Memory Lane - Backend API

## Description

This repository contains the **Backend (Express API)** for the Memory Lane project. Memory Lane is a nostalgic time capsule application that allows users to create, share, and unlock digital time capsules filled with memories and messages.

**This is the Backend repository** - a RESTful API built with Express.js, MongoDB, and JWT authentication. The frontend React application can be found [here](https://github.com/KaterynaSoloviova/memory-lane-client) (replace with actual frontend repo link).

## Features

- 🔐 **User Authentication**: JWT-based authentication with secure password hashing
- 📧 **Email Notifications**: Automated email system for invitations and capsule unlocks
- 🗄️ **MongoDB Database**: Robust data storage with Mongoose ODM
- 🚀 **RESTful API**: Clean, organized endpoints for all functionality
- 🔒 **Security**: CORS protection, input validation, and secure middleware
- 📱 **Real-time Updates**: WebSocket support for live interactions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **Validation**: Custom validators
- **Development**: Nodemon for hot reloading

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Gmail account for email notifications

### 1. Clone the Repository

```bash
git clone https://github.com/KaterynaSoloviova/memory-lane-server.git
cd memory-lane-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5005
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/memory-lane-server
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/memory-lane-server

# JWT Secret
TOKEN_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
NODEMAILER_USER=your-email@gmail.com
NODEMAILER_PWD=your-app-specific-password

# Frontend URL (for CORS)
ORIGIN=http://localhost:3000

# Optional: For production deployment
# PORT=process.env.PORT
# ORIGIN=https://your-frontend-domain.com
```

**Important Notes:**
- **MongoDB**: You can use a local MongoDB installation or create a free account on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Gmail Setup**: For email functionality, you'll need to:
  1. Enable 2-factor authentication on your Gmail account
  2. Generate an "App Password" from Google Account settings
  3. Use that app password in the `NODEMAILER_PWD` variable

### 4. Start the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5005` (or the PORT specified in your .env file).

## API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify JWT token
- `POST /auth/logout` - User logout

### User Routes (`/api/users`)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Time Capsule Routes (`/api/capsules`)
- `POST /api/capsules` - Create new time capsule
- `GET /api/capsules` - Get user's capsules
- `GET /api/capsules/:id` - Get specific capsule
- `PUT /api/capsules/:id` - Update capsule
- `DELETE /api/capsules/:id` - Delete capsule
- `POST /api/capsules/:id/lock` - Lock capsule
- `GET /api/public`- all public unlocked capsules
- `POST /api/trigger-unlocks` - Send capsule notification emails for all unlocked capsules


### Invitation Routes (`/api/invitations`)
- `POST /api/invitations` - Send invitation
- `GET /api/invitations` - Get user's invitations

### Comment Routes (`/api/comments`)
- `POST /api/comments/:capsuleId` - Add comment to capsule
- `GET /api/comments/:capsuleId` - Get capsule comments

## Database Models

- **User**: Authentication and profile information
- **TimeCapsule**: Core time capsule data and content
- **Invitation**: User invitations to join capsules
- **Comment**: User comments and messages within capsules

## Project Structure

```
memory-lane-server/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── config/               # Middleware and app configuration
├── db/                   # Database connection
├── error-handling/       # Global error handling
├── middleware/           # Custom middleware (JWT, etc.)
├── models/               # MongoDB schemas
├── routes/               # API route definitions
├── utils/                # Utility functions (email, validation)
└── package.json          # Dependencies and scripts
```

## Demo

- **Backend API**: [Memory Lane API on Render](https://memory-lane-app-mz1n.onrender.com)
- **Frontend Application**: [Deployed on Netlify](https://memory-lane-web.netlify.app/)

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact Kateryna Soloviova.

---

**Note**: This is the Backend API repository. The frontend React application can be found [here](https://github.com/KaterynaSoloviova/memory-lane-client).

---

**Made with ❤️ by Kateryna Soloviova**