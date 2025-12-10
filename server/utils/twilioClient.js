const twilio = require('twilio');

// Initialize Twilio client with environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS using Twilio
 * @param {string} to - Recipient phone number (E.164 format)
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} Twilio message object
 */
const sendOtpSms = async (to, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your voting app verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log(`OTP SMS sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending OTP SMS:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Validate phone number format (basic E.164 validation)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid format
 */
const isValidPhoneNumber = (phoneNumber) => {
  // Basic E.164 format validation: + followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
};

/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - Raw phone number input
 * @returns {string} Formatted E.164 phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters except leading +
  let formatted = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add +1 for US numbers (adjust as needed)
  if (!formatted.startsWith('+')) {
    formatted = '+1' + formatted.replace(/\D/g, '');
  }
  
  return formatted;
};

module.exports = {
  sendOtpSms,
  isValidPhoneNumber,
  formatPhoneNumber
};
