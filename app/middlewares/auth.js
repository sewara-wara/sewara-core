const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig.js");
const statusCode = require('../config/statusCode.js');

exports.verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(statusCode.token_unprovide).send({
            code: statusCode.token_unprovide,
            message: "No token provided!"
        });
    }

    try {
        const decoded = await verifyAsync(token, authConfig.secret);
        req.id_user = decoded.id;
        next();
    } catch (err) {
        return res.status(statusCode.unauthorized).send({
            code: statusCode.unauthorized,
            message: "Unauthorized!",
            error: err
        });
    }
};