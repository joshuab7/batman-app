# Batman Universe Explorer
**Check Out the live deployment on render! https://batman-app.onrender.com**
An interactive web application for exploring the Batman universe, featuring character profiles, user authentication, favorites, and ratings.

## Features

- **Character Exploration**: Browse and search for Batman characters
- **Detailed Character Profiles**: View comprehensive information about each character
- **User Authentication**: Register, login, and maintain a user profile
- **Favorites System**: Add characters to your favorites collection
- **Rating System**: Rate characters on a five-star scale
- **Theme Toggle**: Switch between Batman and Joker themed interfaces

## Technologies Used

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- CSS for styling

### Backend

- Node.js with Express
- PostgreSQL database
- JWT for authentication
- RESTful API architecture

### External API

- Batman API for character data

## Database Schema

The application uses PostgreSQL with the following:
SCHEMA: https://drive.google.com/file/d/13Opr7ncNRPSTw1XDRlWJzVcnQZohkovQ/view?usp=sharing

Key tables:

- `users`: Stores user account information
- `favorites`: Tracks user's favorite characters
- `ratings`: Stores user ratings for characters
- `user_preferences`: Stores user theme preferences
- See the full schema in `backend/src/config/batman_explorer_schema.sql`

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- PostgreSQL (v12+ recommended)

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/batman_db
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Create the PostgreSQL database:

   ```
   createdb batman_db
   ```

5. Initialize the database schema:

   ```
   psql -d batman_db -f src/config/batman_explorer_schema.sql
   ```

6. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:

   ```
   npm start
   ```

5. The application should now be running at `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials
2. Browse the character catalog
3. Search for specific characters
4. View detailed character profiles
5. Add characters to your favorites
6. Rate characters on a 5-star scale
7. Toggle between Batman and Joker themes

## API Endpoints

### User Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login an existing user
- `GET /api/users/profile` - Get the current user's profile
- `PUT /api/users/theme` - Update user theme preference

### Character Routes

- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get a specific character
- `GET /api/characters/search` - Search for characters
- `GET /api/characters/user/favorites` - Get user's favorite characters
- `POST /api/characters/:id/favorite` - Add a character to favorites
- `DELETE /api/characters/:id/favorite` - Remove a character from favorites
- `POST /api/characters/:id/rate` - Rate a character

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- This project was created as a capstone project for springboard
- Character data is provided by the Batman API

