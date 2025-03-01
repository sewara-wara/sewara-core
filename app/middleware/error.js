const statusCode = require('../config/statusCode.js');

exports.errorCatch = (error, response) => {
    if (error) {
        console.error(error);
        return response.status(statusCode.internal_server_error).send({
            code: statusCode.internal_server_error,
            message: error.message,
            error: error
        });
    }
}

exports.error = (message, status, response) => {
    const error = new Error(message);
    const code = status || statusCode.internal_server_error;
    error.statusCode = code;
    console.error(error);
    return response.status(code).send({
        code: code,
        message: message || 'Internal Server Error',
        error: error
    });
}