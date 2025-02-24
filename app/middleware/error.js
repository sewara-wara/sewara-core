const statusCode = require('../config/statusCode.js');

exports.handleError = (error, response) => {
    if (error) {
        return response.status(statusCode.bad_request).send({
            code: statusCode.bad_request,
            message: error.message,
            error: error
        });
    }
}