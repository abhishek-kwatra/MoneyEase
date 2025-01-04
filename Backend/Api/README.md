api
├── index.js           # Entry point for backend, usually server setup
├── config
│   ├── passport.js    # Passport configuration
│   ├── database.js    # Database configuration
├── routes
│   ├── auth.js        # Authentication routes
│   ├── protected.js   # Protected routes
├── controllers
│   ├── authController.js  # Authentication logic
│   ├── protectedController.js  # Logic for protected routes

frontend
├── public
│   └── index.html     # Main HTML file
├── src
│   ├── components     # React components
│   │   ├── Login.js
│   │   ├── ProtectedPage.js
│   │   ├── ProtectedRoute.js
│   ├── context
│   │   ├── AuthContext.js
│   ├── services
│   │   ├── authService.js
│   ├── App.js
│   ├── index.js       # Entry point for frontend, rendering React components
|   |