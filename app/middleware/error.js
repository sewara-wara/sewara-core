const statusCode = require('../config/statusCode.js');

exports.error = (error, code, message, response) => {
    if (error) {
        console.error(error);
        return response.status(statusCode.bad_request).json({
            code: statusCode.bad_request,
            message: error.message,
            error: error
        });
    } else {
        const error = new Error(message);
        error.statusCode = code || 500;
        
        console.error(error);
        return response.status(code).json({
            code: code,
            message: message || 'Internal Server Error',
            error: error
        });
    }
}