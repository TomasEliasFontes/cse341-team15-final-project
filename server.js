// server.js
require("dotenv").config();
const express = require("express");
const mongodb = require("./db/connect");
const passport = require("passport");
const session = require("express-session");
const githubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app
  .use(express.json())
  .use(
    session({
      // session secret comes from .env (fall back to a default for local dev)
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  // CORS & headers
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  })
  .use(cors({ methods: "GET, POST, PUT, DELETE, UPDATE, PATCH" }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes"));

// request logging
app.use(morgan("dev"));

// -----------------------------
// Passport GitHub Strategy
// -----------------------------
passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // For simplicity, return the profile object.
      // In a real app, you'd lookup or create a user record here.
      return done(null, profile);
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// -----------------------------
// 404 handler (must be after routes)
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
});

// -----------------------------
// Global error handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // If headers already sent, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong!",
    statusCode: err.status || 500,
  });
});

// -----------------------------
// Initialize MongoDB and start server conditionally
// -----------------------------
// We initialize the DB here. If this file is executed directly (node server.js)
// we will start the HTTP server after DB init. If the file is imported (e.g.
// by tests using supertest), we will NOT start the server automatically.
mongodb.initDb((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);

    // If running as main process, exit with failure; otherwise throw so tests can catch it
    if (require.main === module) {
      process.exit(1);
    } else {
      // When imported in tests, throwing will let the test fail/handle DB init error.
      throw err;
    }
  }

  console.log("Connected to MongoDB");

  // Start the HTTP server only when this file is executed directly.
  if (require.main === module) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});

// Export the app object for use in tests (supertest) or other modules
module.exports = app;
