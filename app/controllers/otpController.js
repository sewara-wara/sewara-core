const db = require('../config/dbConfig.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manarakubah@gmail.com',
    pass: 'iphncuqgregsspyf'
  }
});

exports.sendOtp = async (userId, email) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
    
        await db.query(
            'INSERT INTO user_otp (user_id, otp, otp_expires_at) VALUES (?, ?, ?)',
            [userId, otp, otpExpiresAt]
        );
    
        const mailOptions = {
            from: 'Manara',
            to: email,
            subject: 'Verifikasi Email Anda',
            text: `Kode OTP Anda adalah: ${otp}. Kode ini akan kedaluwarsa dalam 15 menit.`
        };
  
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Gagal mengirim OTP');
    }
};