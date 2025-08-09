const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  // 1. If user is logged in with a session (browser)
  if (req.session && req.session.user) {
    return next();
  }

  // 2. If using JWT in Authorization header (API clients)
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store token payload for later use
      return next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  }

  // 3. If neither session nor token exists → unauthorized
  return res.status(401).json({ error: "Unauthorized" });
}

module.exports = { isAuthenticated };
