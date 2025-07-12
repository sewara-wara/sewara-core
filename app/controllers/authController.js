const db = require('../config/dbConfig.js');
const authConfig = require("../config/authConfig.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');
const { sanitizeUser } = require('../helpers/userHelper');
const { sendOtp } = require('./otpController'); 

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(errorResponse('Semua field wajib diisi', statusCode.bad_request));
        }
    
        const [existingUser] = await db.query('SELECT id FROM user WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return next(errorResponse('Email sudah terdaftar', statusCode.already_exists));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO user (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [name, email, hashedPassword]
        );
        const userId = result.insertId;
    
        await sendOtp(userId, email);
    
        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Registrasi berhasil. Silakan periksa email Anda untuk verifikasi'
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(errorResponse('Email dan password wajib diisi', statusCode.bad_request));
        }
    
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (users.length === 0) {
            return next(errorResponse('Email belum terdaftar', statusCode.not_found));
        }
    
        const user = users[0];
    
        if (!user.is_verified) {
            await sendOtp(user.id, email);
            return res.status(statusCode.forbidden).json({
                code: statusCode.forbidden,
                message: 'Akun Anda belum diverifikasi. OTP telah dikirim ulang ke email Anda'
            });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(errorResponse('Password salah', statusCode.unauthorized));
        }
        let token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 31536000 // 1 year
        });
        await db.query('UPDATE user SET token = ? WHERE id = ?', [token, user.id]);
        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Login berhasil',
            user: sanitizeUser(user),
            session: token
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(errorResponse('Email dan OTP wajib diisi', statusCode.bad_request));
        }
    
        const [users] = await db.query('SELECT id, is_verified FROM user WHERE email = ?', [email]);
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
            'SELECT id, otp, otp_expires_at, is_used FROM user_otp WHERE user_id = ? AND otp = ? ORDER BY requested_at DESC LIMIT 1',
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
    
        await db.query('UPDATE user SET is_verified = 1, updated_at = NOW() WHERE id = ?', [user.id]);
        await db.query('UPDATE user_otp SET is_used = 1 WHERE id = ?', [otpRecord.id]);
    
        res.status(statusCode.success).json({ 
            code: statusCode.success,
            message: 'Email berhasil diverifikasi' 
        });
    } catch (error) {
        next(error);
    }
};