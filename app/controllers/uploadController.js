const statusCode = require('../config/statusCode.js');
const { errorResponse } = require('../helpers/errorHelper.js');
const asyncHandler = require('../helpers/asyncHandler.js');
const { createProfileUploadParams } = require('../helpers/cloudinaryHelper.js');

exports.getUploadSignature = asyncHandler(async (req, res, next) => {
    const { type } = req.body;

    if (type !== 'profile') {
        return next(errorResponse('Tipe upload tidak valid', statusCode.bad_request));
    }

    res.status(statusCode.success).json({
        code: statusCode.success,
        message: 'Signature upload berhasil dibuat.',
        data: createProfileUploadParams(req.id_user)
    });
});
