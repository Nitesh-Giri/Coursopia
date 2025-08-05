# Coursopia

Coursopia is a modern course-selling platform designed to connect educators with learners. It provides a seamless experience for creating, managing, and purchasing courses.

## Features

- **User Authentication**: Secure login and signup for users and admins.
- **Admin Dashboard**: Manage courses, view purchases, and update course details.
- **Course Management**: Create, update, and delete courses.
- **Purchase System**: Users can buy courses and view their purchases.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/coursopia.git
   cd coursopia
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```
   - Backend:
     ```bash
     cd backend
     npm start
     ```

5. Open your browser and navigate to `http://localhost:5173` for the frontend.

## Folder Structure

### Frontend
- `src/components`: Reusable React components.
- `src/admin`: Admin-specific pages and components.
- `public`: Static assets.

### Backend
- `controllers`: Business logic for handling requests.
- `models`: Database schemas.
- `routes`: API endpoints.
- `middlewares`: Custom middleware for request handling.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.