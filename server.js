require("dotenv").config();
const express = require("express");
const mongodb = require("./db/connect");
const passport = require("passport");
const session = require("express-session");
const githubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const morgan = require('morgan');
const port = process.env.PORT || 8080;
const app = express();

// Middleware to parse JSON request bodies
app
  .use(express.json())
  .use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
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
  .use(cors({methods: "GET, POST, PUT, DELETE, UPDATE, PATCH"}))
  .use(cors({origin: "*"}))
  .use("/", require("./routes"));

app.use(morgan('dev'));

// Passport GitHub Strategy Configuration
passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // For simplicity, we will just return the profile
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

// 404 Error Handler - Must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong!",
    statusCode: err.status || 500,
  });
});

mongodb.initDb((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
