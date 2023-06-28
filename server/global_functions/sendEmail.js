const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (to, subject, body) => {
    try {
        // Create a transporter with your email service provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'mail.photosher.com',
            port: 465,
            secure: true,
            auth: {
                user: 'test@photosher.com',
                pass: '-vbpfAi3W5zk3iE',
            },
        });

        // Define the email options
        const mailOptions = {
            from: 'test@photosher.com',
            to: to,
            subject: subject,
            text: body,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
