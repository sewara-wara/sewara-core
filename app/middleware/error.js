const statusCode = require('../config/statusCode.js');

exports.error = (error, response) => {
    if (error) {
        console.error(error);
        return response.json({
            code: statusCode.bad_request,
            message: error.message,
            error: error
        });
    } else {
        const error = new Error(message);
        error.statusCode = statusCode || 500;
        console.error(error);
        return response.json({
            code: code,
            message: message || 'Internal Server Error',
            error: error
        });
    }
}