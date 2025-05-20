// utils/logger.js
const logger = {
    info: (message) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[INFO] ${message}`);
      }
    },
    error: (message) => {
      console.error(`[ERROR] ${message}`);
    },
    sensitive: (message) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SENSITIVE] ${message}`);
      } else {
        console.log(`[SENSITIVE] Action performed (details hidden in production)`);
      }
    }
  };
  
  module.exports = logger;