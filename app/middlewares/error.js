const statusCode = require('../config/statusCode.js');

module.exports = (err, req, res, next) => {
    const code = err.statusCode || statusCode.internal_server_error;
    console.error(err.stack);
    res.status(code).json({
        code: code,
        message: err.message || 'Internal Server Error',
        error: err
    });
};


// exports.errorResponse = (message, statusCode) => {
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     return error;
// };