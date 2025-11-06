# Clothify

Clothify is a full-stack e-commerce platform for buying and selling clothing items. It features user authentication, product listings, admin approvals, and more.

## Features

- User registration and login
- Product browsing and purchasing
- Admin panel for managing products and approvals
- File uploads for product images
- Secure API with JWT authentication
- Responsive UI with Chakra UI

## Tech Stack

### Backend
- **Node.js** with **Express.js** for the API server
- **MongoDB** with **Mongoose** for database
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Helmet** and **CORS** for security
- **Express Rate Limit** for rate limiting

### Frontend
- **React** with **Vite** for fast development
- **Chakra UI** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **Lucide React** for icons

## File Structure

```
Clothify/
├── backend/
│   ├── controllers/          # API controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── uploads/              # Uploaded files
│   ├── utils/                # Utility functions
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main server file
└── frontend/
    ├── public/               # Static assets
    ├── src/                  # Source code
    │   ├── pages/            # React pages
    │   └── ...               # Other components
    ├── .env                  # Environment variables
    ├── .gitignore            # Git ignore rules
    ├── eslint.config.js      # ESLint config
    ├── index.html            # Main HTML file
    ├── package.json          # Frontend dependencies
    ├── README.md             # Frontend-specific README
    └── vite.config.js        # Vite config
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Clothify
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

### Backend .env
```
MONGO_URI=mongodb://localhost:27017/clothify
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api
```

*Note: Replace the placeholder values with your actual configuration. For security, never commit `.env` files to version control.*

## Usage

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port).

3. Open your browser and navigate to the frontend URL to use the application.

## Scripts

### Backend
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run seed`: Seed the database (if applicable)

### Frontend
- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
