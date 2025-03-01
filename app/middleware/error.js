const statusCode = require('../config/statusCode.js');

exports.error = (error, response) => {
    if (error) {
        console.error(error);
        return response.status(statusCode.bad_request).send({
            code: statusCode.bad_request,
            message: error.message,
            error: error
        });
    }
}