const rateLimit = require('express-rate-limit');

const questionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 20, // maksimal 20 request per IP per menit
    message: {
        code: 429,
        message: 'Terlalu banyak permintaan. Coba lagi nanti.'
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10,
    message: {
        code: 429,
        message: 'Terlalu banyak percobaan login. Coba lagi nanti.'
    }
});

module.exports = {
    questionLimiter,
    authLimiter
};