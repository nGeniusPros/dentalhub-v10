const crypto = require('crypto');

/**
 * Verify the Retell webhook signature
 * @param {string} signature - The signature from the x-retell-signature header
 * @param {string} payload - The raw request body
 * @param {string} secret - The webhook secret from Retell
 * @returns {boolean} - True if the signature is valid
 */
function verifyWebhookSignature(signature, payload, secret) {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const computedSignature = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Format a phone number for Retell
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - The formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  // Remove all non-numeric characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Check if the number starts with a country code
  if (cleaned.length === 10) {
    return `+1${cleaned}`; // Default to US/CA
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+${cleaned}`;
  } else if (cleaned.length > 0) {
    return `+${cleaned}`;
  }
  
  return phoneNumber; // Return as is if we can't format it
}

module.exports = {
  verifyWebhookSignature,
  formatPhoneNumber
};
