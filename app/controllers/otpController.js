const db = require('../config/dbConfig.js');
const nodemailer = require('nodemailer');
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');

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
            'INSERT INTO user_otps (user_id, otp, otp_expired_at) VALUES (?, ?, ?)',
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

exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(errorResponse('Email wajib diisi', statusCode.bad_request));
        }

        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const user = users[0];

        if (user.is_verified) {
            return res.status(statusCode.already_verify).json({
                code: statusCode.already_verify,
                message: 'Akun Anda sudah terverifikasi.'
            });
        }
    
        await exports.sendOtp(user.id, email);
    
        res.status(statusCode.success).json({ 
            code: statusCode.success,
            message: 'OTP berhasil dikirim ulang ke email Anda.' 
        });
    } catch (error) {
        next(error);
    }
};