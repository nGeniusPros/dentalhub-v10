const nodemailer = require('nodemailer');
const { handleOptions, success, error } = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    // Get email credentials from environment variables
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const from = process.env.EMAIL_FROM;

    // Validate environment variables
    if (!host || !port || !user || !pass || !from) {
      return error('Missing email configuration', 500);
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === '465',
      auth: {
        user,
        pass,
      },
    });

    // Get request body
    const { to, subject, text, html, attachments } = JSON.parse(event.body);

    // Validate required parameters
    if (!to || !subject || (!text && !html)) {
      return error('Missing required parameters: to, subject, and either text or html', 400);
    }

    // Send email
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments,
    });

    return success({
      messageId: info.messageId,
      message: 'Email sent successfully',
    });
  } catch (err) {
    console.error('Email function error:', err);
    return error(`Failed to send email: ${err.message}`);
  }
};