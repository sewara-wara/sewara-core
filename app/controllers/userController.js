const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');
const { sanitizeUser } = require('../helpers/userHelper');
const { sendOtp } = require('./otpController');

exports.getUser = async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT * FROM user');

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil data user berhasil.',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserDetail = async (req, res, next) => {
    try {
        const id = req.id_user;

        if (!id) {
            return res.status(statusCode.bad_request).json({
                code: statusCode.bad_request,
                message: 'Parameter ID wajib disertakan.',
                data: null
            });
        }

        const [user] = await db.query('SELECT * FROM user WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(statusCode.not_found).json({
                code: statusCode.not_found,
                message: 'User tidak ditemukan.',
                data: null
            });
        }

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil detail user berhasil.',
            data: sanitizeUser(user[0])
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { name, email } = req.body;

        if (!name || !email) {
            return next(errorResponse('Nama dan email wajib diisi', statusCode.bad_request));
        }

        const [updateResult] = await db.query(
            'UPDATE user SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
            [name, email, id]
        );

        if (updateResult.affectedRows === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const [users] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
        const user = users[0];

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Data user berhasil diperbarui.',
            data: sanitizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { old_password, new_password } = req.body;
        
        if (!old_password || !new_password) {
            return next(errorResponse('Kata sandi lama dan kata sandi baru wajib diisi', statusCode.bad_request));
        }
        
        const [users] = await db.query('SELECT password FROM user WHERE id = ?', [id]);
        if (users.length === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const user = users[0];

        
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return next(errorResponse('Kata sandi lama tidak cocok', statusCode.unauthorized));
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        await db.query(
            'UPDATE user SET password = ?, updated_at = NOW() WHERE id = ?',
            [hashedNewPassword, id]
        );

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Kata sandi berhasil diperbarui.'
        });
    } catch (error) {
        next(error);
    }
};