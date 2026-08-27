const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig.js");
const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');

exports.verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return next(errorResponse('No token provided!', statusCode.token_unprovide));
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return next(errorResponse('Unauthorized!', statusCode.unauthorized));
      }
      req.id_user = decoded.id;
      next();
    });
};