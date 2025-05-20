// middleware/requestLogger.js
const logRequest = (req, res, next) => {
    // Skip logging sensitive endpoints
    const sensitiveEndpoints = ['/person/send-otp', '/person/verify-otp'];
    
    if (sensitiveEndpoints.includes(req.originalUrl)) {
      console.log(
        `[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl} (sensitive endpoint - details not logged)`
      );
    } else {
      console.log(
        `[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`
      );
    }
    next();
  };
  
  module.exports = logRequest;