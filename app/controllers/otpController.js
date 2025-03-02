const db = require('../config/dbConfig.js');
const nodemailer = require('nodemailer');
const { errorResponse } = require('../helpers/errorResponse');
const { sendOtp } = require('./otpController');

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
        from: 'manarakubah@gmail.com',
        to: email,
        subject: 'Verifikasi Email Anda',
        text: `Kode OTP Anda adalah: ${otp}. Kode ini akan kedaluwarsa dalam 15 menit.`
    };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Gagal mengirim OTP');
    }
};

exports.resendOtp = async (req, res, next) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT id FROM user WHERE email = ?', [email]);
        if (users.length === 0) {
            return next(errorResponse('User tidak ditemukan', 404));
        }
    
        const user = users[0];
    
        await sendOtp(user.id, email);
    
        res.status(200).json({ 
            message: 'OTP berhasil dikirim ulang ke email Anda.' 
        });
    } catch (error) {
        next(error);
    }
};