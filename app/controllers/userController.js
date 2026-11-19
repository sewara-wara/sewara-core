const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const bcrypt = require("bcryptjs");
const { errorResponse } = require('../helpers/errorHelper.js');
const { sanitizeUser, USER_ROLES, normalizePhone } = require('../helpers/userHelper');
const { isOwnProfilePhotoUrl } = require('../helpers/cloudinaryHelper.js');

exports.getUser = async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT * FROM users');

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil data user berhasil.',
            data: users.map(sanitizeUser)
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

        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

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
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return next(errorResponse('Nama dan email wajib diisi', statusCode.bad_request));
        }

        const fields = ['name = ?', 'email = ?'];
        const values = [name, email];

        // phone is optional: omit it to keep the current number, send null or "" to remove it
        if (phone !== undefined) {
            const normalizedPhone = phone ? normalizePhone(phone) : null;
            if (phone && !normalizedPhone) {
                return next(errorResponse('Nomor HP tidak valid', statusCode.bad_request));
            }
            fields.push('phone = ?');
            values.push(normalizedPhone);
        }

        const [updateResult] = await db.query(
            `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
            [...values, id]
        );

        if (updateResult.affectedRows === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
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
        
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [id]);
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
            'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
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

exports.updatePhoto = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { image_profile } = req.body;

        if (!image_profile) {
            return next(errorResponse('URL foto wajib diisi', statusCode.bad_request));
        }

        if (!isOwnProfilePhotoUrl(image_profile, id)) {
            return next(errorResponse('URL foto tidak valid', statusCode.bad_request));
        }

        const [updateResult] = await db.query(
            'UPDATE users SET image_profile = ?, updated_at = NOW() WHERE id = ?',
            [image_profile, id]
        );

        if (updateResult.affectedRows === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Foto profil berhasil diperbarui.',
            data: sanitizeUser(users[0])
        });
    } catch (error) {
        next(error);
    }
};

exports.updateRole = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { role } = req.body;

        if (!USER_ROLES.includes(role)) {
            return next(errorResponse('Role harus seeker atau owner', statusCode.bad_request));
        }

        const [updateResult] = await db.query(
            'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
            [role, id]
        );

        if (updateResult.affectedRows === 0) {
            return next(errorResponse('User tidak ditemukan', statusCode.not_found));
        }

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Tipe user berhasil diperbarui.',
            data: sanitizeUser(users[0])
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.id_user;

        await db.query(
            'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
            [0, id]
        );

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Akun Anda telah berhasil dihapus dari sistem kami. Terima kasih telah menggunakan layanan kami.'
        });
    } catch (error) {
        next(error);
    }
};