module.exports = authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      try {
        // Check if the user's role is allowed
        if (!allowedRoles.includes(req.role)) {
          return res.status(403).send({
            error: "Forbidden",
            message: "You do not have permission to access this resource.",
          });
        }
  
        // If allowed, call the next middleware
        next();
      } catch (error) {
        res.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred.",
        });
      }
    };
  };
  