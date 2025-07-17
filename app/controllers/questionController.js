const db = require('../config/dbConfig.js');
const { errorResponse } = require('../helpers/errorHelper.js');

exports.createQuestion = async (req, res, next) => {
    try {
        const id = req.id_user;
        const { question, image } = req.body;

        if (!question) {
            return next(errorResponse('Pertanyaan wajib diisi', statusCode.bad_request));
        }

        await db.query(`
            INSERT INTO questions (user_id, content, image)
            VALUES (?, ?, ?)
        `, [id, content, image || null]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Pertanyaan berhasil dibuat.'
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllQuestions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM questions
        `);

        const [questions] = await db.query(`
            SELECT 
                q.id,
                q.user_id,
                u.name AS user_name,
                q.content,
                q.image,
                q.created_at,
                q.updated_at
            FROM questions q
            JOIN users u ON q.user_id = u.id
            ORDER BY q.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil semua data pertanyaan berhasil.',
            data: questions,
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

exports.getUserQuestions = async (req, res, next) => {
    try {
        const id = req.id_user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total FROM questions WHERE user_id = ?
        `, [id]);

        const [questions] = await db.query(`
            SELECT 
                q.id,
                q.user_id,
                u.name AS user_name,
                q.content,
                q.image,
                q.created_at,
                q.updated_at
            FROM questions q
            JOIN users u ON q.user_id = u.id
            WHERE q.user_id = ?
            ORDER BY q.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, limit, offset]);

        res.status(statusCode.success).json({
            code: statusCode.success,
            message: 'Mengambil data pertanyaan user berhasil.',
            data: questions,
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