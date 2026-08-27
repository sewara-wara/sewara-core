const statusCode = require('../config/statusCode.js');

module.exports = (err, req, res, next) => {
    const code = err.statusCode || statusCode.internal_server_error;
    console.error(err.stack);

    const response = {
        code: code,
        message: err.message || 'Internal Server Error'
    };

    // Only leak stack traces outside production to avoid exposing internals to clients
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(code).json(response);
};