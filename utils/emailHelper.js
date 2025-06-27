const nodemailer = require('nodemailer');
require('dns').setDefaultResultOrder('ipv4first');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure : true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

/**
 * Kirim OTP ke email.
 * @param {string} toEmail 
 * @param {string} otpCode 
 */

const sendOtpEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    from: `"No-Reply" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your OTP Code',
    text: `Kode OTP kamu: ${otpCode}. Berlaku 10 menit.`,
    html: `<p>Kode OTP kamu: <b>${otpCode}</b></p><p>Masa berlaku: 10 menit</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};


module.exports = {
    sendOtpEmail,
};
// const transporter = require('../configs/mailer');

// module.exports = async (to, subject, text, html) => {
//     await transporter.sendMail({
//         from: `Tiketku support <${process.env.EMAIL_USER}>`,
//         to,
//         subject,
//         text,
//         html
//     });
// };