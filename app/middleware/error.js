const statusCode = require('../config/statusCode.js');

exports.error = (error, response) => {
    if (error) {
        return response.status(statusCode.bad_request).json({
            code: statusCode.bad_request,
            message: error.message,
            error: error
        });
    }
}

exports.error = (statusCode, message, response) => {
    const code = statusCode || 500;
    const error = new Error(message);
    error.statusCode = code;
    console.error(error);
    
    return response.status(code).json({
        code: code,
        message: message || 'Internal Server Error',
        error: error
    });
}