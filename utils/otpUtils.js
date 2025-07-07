const axios = require("axios");

// MessageCentral environment credentials
const CUSTOMER_ID = process.env.MESSAGECENTRAL_CUSTOMER_ID;
const BASE64_PASSWORD = process.env.MESSAGECENTRAL_BASE64_PASSWORD;
const EMAIL = process.env.MESSAGECENTRAL_EMAIL;

// Step 1: Generate token from MessageCentral
const getAuthToken = async () => {
  const url = `https://cpaas.messagecentral.com/auth/v1/authentication/token?customerId=${CUSTOMER_ID}&key=${BASE64_PASSWORD}&scope=NEW&country=91&email=${EMAIL}`;
  const response = await axios.get(url);
  return response.data.token;
};

// Step 2: Send OTP to user via SMS
const sendOtp = async (mobile) => {
  const authToken = await getAuthToken();
  const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&flowType=SMS&mobileNumber=${mobile}`;
  const response = await axios.post(url, null, {
    headers: { authToken }
  });

  return response.data.data.verificationId;
};

// Step 3: Validate OTP using verificationId and user code
const validateOtp = async (verificationId, code) => {
  const authToken = await getAuthToken();
  const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${code}`;
  const response = await axios.get(url, {
    headers: { authToken }
  });

  return response.data.data.verificationStatus === "VERIFICATION_COMPLETED";
};

module.exports = {
  sendOtp,
  validateOtp
};