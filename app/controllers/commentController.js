const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');

exports.createComment = async (req, res, next) => {
    try {
        const idUser = req.id_user;
        const { postId, content } = req.body;

        if (!content) {
            return next(errorResponse('Komentar wajib diisi', statusCode.bad_request));
        }

        const [[post]] = await db.query(`
            SELECT id FROM posts WHERE id = ? AND status != 0
        `, [postId]);

        if (!post) {
            return next(errorResponse('Postingan tidak ditemukan atau sudah dihapus.', statusCode.not_found));
        }

        await db.query(`
            INSERT INTO comments (post_id, user_id, content)
            VALUES (?, ?, ?)
        `, [postId, idUser, content]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Komentar berhasil dibuat.'
        });
    } catch (error) {
        next(error);
    }
};

exports.getCommentsByPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM comments WHERE post_id = ? AND status = 1
        `, [postId]);

        const [comments] = await db.query(`
            SELECT 
                c.id,
                c.post_id,
                c.user_id,
                u.name AS user_name,
                c.content,
                c.created_at,
                c.updated_at
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ? AND c.status = 1
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `, [postId, limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil komentar berhasil.',
            data: comments,
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

exports.getUserComments = async (req, res, next) => {
    try {
        const idUser = req.id_user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM comments WHERE user_id = ? AND status = 1
        `, [idUser]);

        const [comments] = await db.query(`
            SELECT 
                c.id,
                c.post_id,
                p.title AS post_title,
                c.user_id,
                u.name AS user_name,
                c.content,
                c.created_at,
                c.updated_at
            FROM comments c
            JOIN users u ON c.user_id = u.id
            JOIN posts p ON c.post_id = p.id
            WHERE c.user_id = ? AND c.status = 1
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `, [idUser, limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil komentar user berhasil.',
            data: comments,
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

exports.updateComment = async (req, res, next) => {
    try {
        const idUser = req.id_user;
        const commentId = req.params.commentId;
        const { content } = req.body;

        if (!content) {
            return next(errorResponse('Komentar wajib diisi', statusCode.bad_request));
        }

        const [[comment]] = await db.query(`
            SELECT * FROM comments WHERE id = ? AND user_id = ? AND status = 1
        `, [commentId, idUser]);

        if (!comment) {
            return next(errorResponse('Komentar tidak ditemukan atau bukan milik user.', statusCode.not_found));
        }

        await db.query(`
            UPDATE comments SET content = ?, updated_at = NOW() WHERE id = ?
        `, [content, commentId]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Update komentar berhasil.'
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const idUser = req.id_user;
        const commentId = req.params.commentId;

        const [[comment]] = await db.query(`
            SELECT * FROM comments WHERE id = ? AND user_id = ? AND status = 1
        `, [commentId, idUser]);

        if (!comment) {
            return next(errorResponse('Komentar tidak ditemukan atau sudah dihapus.', statusCode.not_found));
        }

        await db.query(`
            UPDATE comments SET status = 0, updated_at = NOW() WHERE id = ?
        `, [commentId]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Komentar berhasil dihapus.'
        });
    } catch (error) {
        next(error);
    }
};
