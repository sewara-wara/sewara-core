const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig.js");
const statusCode = require('../config/statusCode.js');

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(statusCode.token_unprovide).send({
            code: statusCode.token_unprovide,
            message: "No token provided!"
        });
    }
  
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(statusCode.unauthorized).send({
            code: statusCode.unauthorized,
            message: "Unauthorized!",
            error: err
        });
      }
      req.id_user = decoded.id;
      next();
    });
};