const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');

exports.createPost = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { content, image } = req.body;

        if (!content) {
            return next(errorResponse('Konten wajib diisi', statusCode.bad_request));
        }

        await db.query(`
            INSERT INTO posts (user_id, content, image)
            VALUES (?, ?, ?)
        `, [id, content, image || null]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Postingan berhasil dibuat.'
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM posts
        `);

        const [posts] = await db.query(`
            SELECT 
                p.id,
                p.user_id,
                u.name AS user_name,
                p.content,
                p.image,
                p.created_at,
                p.updated_at
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.status != 2
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil semua data postingan berhasil.',
            data: posts,
            pagination: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserPosts = async (req, res, next) => {
    try {
        const id = req.id_user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM posts WHERE user_id = ?
        `, [id]);

        const [posts] = await db.query(`
            SELECT 
                p.id,
                p.user_id,
                u.name AS user_name,
                p.content,
                p.image,
                p.created_at,
                p.updated_at
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ? AND p.status != 2
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil data postingan user berhasil.',
            data: posts,
            pagination: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const idUser = req.id_user;
        const postId = req.params.id;
        const { content, image } = req.body;

        if (!content) {
            return next(errorResponse('Konten wajib diisi', statusCode.bad_request));
        }

        const [[post]] = await db.query(`
            SELECT * FROM posts WHERE id = ? AND user_id = ?
        `, [postId, idUser]);

        if (!post) {
            return next(errorResponse('Post tidak ditemukan atau bukan milik user.', statusCode.not_found));
        }

        await db.query(`
            UPDATE posts SET content = ?, image = ?, updated_at = NOW() WHERE id = ?
        `, [content, image || post.image, postId]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Update postingan berhasil.'
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const idUser = req.id_user;
        const postId = req.params.id;

        const [[post]] = await db.query(`
            SELECT * FROM posts WHERE id = ? AND user_id = ? AND status != 2
        `, [postId, idUser]);

        if (!post) {
            return next(errorResponse('Post tidak ditemukan atau sudah dihapus.', statusCode.not_found));
        }

        await db.query(`
            UPDATE posts SET status = 2, updated_at = NOW() WHERE id = ?
        `, [postId]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Post berhasil dihapus (soft delete).'
        });
    } catch (error) {
        next(error);
    }
};