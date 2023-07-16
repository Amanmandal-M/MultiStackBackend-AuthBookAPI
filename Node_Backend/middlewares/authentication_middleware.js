const jwt = require("jsonwebtoken");

module.exports = authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.NORMAL_KEY);
    
    // Extract the user ID and role from the decoded token
    const userId = decoded.userId;
    const role = decoded.role;

    // Attach the user ID and role to the request object for further use
    req.userId = userId;
    req.role = role;

    // Call the next middleware
    next();
  } catch (error) {
    res.status(401).send({
      error: "Unauthorized",
      message: "Invalid token.",
    });
  }
};
