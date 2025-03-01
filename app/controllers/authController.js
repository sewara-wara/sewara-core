const db = require('../config/dbConfig.js');
const authConfig = require("../config/authConfig.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorResponse');
const nodemailer = require('nodemailer');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manarakubah@gmail.com',
    pass: 'iphncuqgregsspyf'
  }
});

exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return next(errorResponse('Semua field wajib diisi', statusCode.bad_request));
        }
    
        const [existingUser] = await db.query('SELECT id FROM user WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return next(errorResponse('Email sudah terdaftar silahkan login.', statusCode.already_exists));
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.query(
            'INSERT INTO user (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [username, email, hashedPassword]
        );
        const userId = result.insertId;
    
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
        await db.query(
            'INSERT INTO user_otp (user_id, otp, otp_expires_at) VALUES (?, ?, ?)',
            [userId, otp, otpExpiresAt]
        );
    
        await sendOtp(userId, email);
    
        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Registrasi berhasil. Silakan periksa email Anda untuk verifikasi.',
            userId: userId
        });
    } catch (error) {
        next(error);
    }
};

const sendOtp = async (userId, email) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
  
      await db.query(
        'INSERT INTO user_otps (user_id, otp, otp_expires_at) VALUES (?, ?, ?)',
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
        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return next(errorResponse('User tidak ditemukan', 404));
        }
    
        const user = users[0];
    
        await sendOtp(user.id, email);
    
        res.status(200).json({ message: 'OTP berhasil dikirim ulang ke email Anda.' });
    } catch (error) {
        next(errorResponse('Gagal mengirim ulang OTP.', 500));
    }
};

exports.verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;
    
    try {
        if (!email || !otp) {
            return next(errorResponse('Email dan OTP wajib diisi', statusCode.bad_request));
        }
    
        const [users] = await db.query('SELECT id, is_verified FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }
    
        const user = users[0];
    
        if (user.is_verified) {
            return res.status(statusCode.success).json({ 
                code: statusCode.success,
                message: 'Email sudah terverifikasi' 
            });
        }
    
        const [otpRecords] = await db.query(
            'SELECT id, otp, otp_expires_at, is_used FROM user_otps WHERE user_id = ? AND otp = ? ORDER BY requested_at DESC LIMIT 1',
            [user.id, otp]
        );
    
        if (otpRecords.length === 0) {
            return next(errorResponse('OTP tidak valid', statusCode.otp_not_valid));
        }
    
        const otpRecord = otpRecords[0];
        const now = new Date();
    
        if (otpRecord.is_used || now > new Date(otpRecord.otp_expires_at)) {
            return next(errorResponse('OTP sudah digunakan atau kadaluarsa', statusCode.otp_expired));
        }
    
        await db.query('UPDATE users SET is_verified = 1, updated_at = NOW() WHERE id = ?', [user.id]);
        await db.query('UPDATE user_otps SET is_used = 1 WHERE id = ?', [otpRecord.id]);
    
        res.status(statusCode.success).json({ 
            code: statusCode.success,
            message: 'Email berhasil diverifikasi' 
        });
    } catch (error) {
        next(error);
    }
};

// exports.login = (request, response) => {
//     const email = request.body.email
//     const password = request.body.password

//     let query = "SELECT * FROM users WHERE email = ?"
//     db.pool.query(query, [email], (error, results) => {
//         baseError.handleError(error, response)

//         if (results.length == 0) {
//             return response.json({
//                 code: statusCode.empty_data,
//                 message: "Akun tidak ditemukan"
//             });
//         }

//         let passwordIsValid = bcrypt.compareSync(
//             password,
//             results[0].password
//         );
//         if (passwordIsValid) {
//             let token = jwt.sign({ id: results[0].id }, authConfig.secret, {
//                 expiresIn: 31536000 // 1 year
//             });
//             response.json({
//                 code: statusCode.success,
//                 message: "Login Berhasil",
//                 data: results[0],
//                 session: token
//             });
//         } else {
//             response.json({
//                 code: statusCode.wrong_password,
//                 message: "Kata sandi salah"
//             });
//         }
//     })
// }