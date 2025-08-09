const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken"); // <-- Added
const { isAuthenticated } = require("../middleware/authenticate");

const router = express.Router();

// Swagger documentation (no auth needed)
router.use("/", require("./swagger.js"));

// Authentication routes (no auth needed)
router.get("/", (req, res) => {
  // #swagger.tags=['Hello World']
  res.send("Hello World! Navigate to /api-docs to view the API documentation.");
});

router.get(
  "/login",
  //#swagger.ignore = true
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/auth", (req, res) => {
  //#swagger.ignore = true
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.username}`
      : "Logged Out"
  );
});

router.get("/auth/github/callback", (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err) {
      console.error("Error in auth callback:", err);
      return res.status(500).json({ error: "Error", message: err.message });
    }
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication failed.",
      });
    }

    // Save user in session
    req.session.user = user;

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token as JSON (so you can use it in Authorization header later)
    res.json({
      message: "Login successful",
      token: token,
      user: user,
    });
  })(req, res, next);
});

router.get(
  "/logout",
  //#swagger.ignore = true
  (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          error: "Logout Error",
          message: "An error occurred while logging out.",
          statusCode: 500,
        });
      }
      req.session.destroy();
      res.redirect("/");
    });
  }
);

// Public API routes (no authentication required)
router.use("/events", require("./events.js"));
router.use("/tickets", require("./tickets.js"));
router.use("/venues", require("./venues.js"));

// Protected API routes (authentication required for ALL routes)
router.use("/customers", isAuthenticated, require("./customers.js"));
router.use("/admin", isAuthenticated, require("./admin.js"));

// 404 Handler - Must be last route
router.use("*", (req, res) => {
  res.send(
    "This route does not exist. Please check the API documentation for available routes."
  );
});

module.exports = router;
