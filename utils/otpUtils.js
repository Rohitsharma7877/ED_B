const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const client = twilio(accountSid, authToken);

// Generate a 4-digit OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Random 4-digit number
};

// Send OTP using Twilio
const sendOtp = async (mobile, otp) => {
  try {
    const recipient = `+91${mobile}`; // Format with country code
    
    // Don't log the actual OTP in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Sending OTP to ${mobile.substring(0, 3)}XXXXX${mobile.substring(8)}`);
    }

    const message = await client.messages.create({
      body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('OTP sent successfully (details hidden in production)');
    }
    
    return message.sid;
  } catch (err) {
    console.error("Error sending OTP:", err.message); // Only log error message, not full error
    throw new Error("Failed to send OTP.");
  }
};
  
  
  

module.exports = { generateOtp, sendOtp };
