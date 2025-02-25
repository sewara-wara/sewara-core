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
    const statusCode = statusCode || 500;
    const error = new Error(message);
    error.statusCode = statusCode;
    console.error(error);
    
    return response.status(statusCode).json({
        code: statusCode.bad_request,
        message: message || 'Internal Server Error',
        error: error
    });
}