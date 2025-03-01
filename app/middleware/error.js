const statusCode = require('../config/statusCode.js');

module.exports = (err, req, res, next) => {
    // Jika error memiliki properti statusCode, gunakan itu, jika tidak default ke 500
    const statusCode = err.statusCode || 500;
    
    // Log error untuk debugging (opsional)
    console.error(err.stack);
    
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      // Anda bisa mengirim detail error tambahan jika diperlukan
      // detail: err
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