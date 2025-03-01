const statusCode = require('../config/statusCode.js');

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.stack);
    res.status(statusCode).json({
        code: statusCode,
        message: err.message || 'Internal Server Error',
        error: err
    });
};

// exports.error = (message, status, response) => {
//     const error = new Error(message);
//     const code = status || statusCode.internal_server_error;
//     error.statusCode = code;
//     console.error(error);
//     return response.status(code).send({
//         code: code,
//         message: message || 'Internal Server Error',
//         error: error
//     });
// }