const nodemailer = require('nodemailer');

module.exports.sendEmail = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing request body',
          statusCode: 400,
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { receiver_email, subject, body_text } = body;

    if (!receiver_email || !subject || !body_text) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields: receiver_email, subject, body_text',
          statusCode: 400,
        }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: receiver_email,
      subject: subject,
      text: body_text,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Email sent successfully',
        info: info.response,
        statusCode: 200,
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send email',
        error: error.message,
        statusCode: 500,
      }),
    };
  }
};
