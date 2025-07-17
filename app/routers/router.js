const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.js");
const bcrypt = require("bcryptjs");
// const upload = require("../middleware/upload.js");

// const version = require('../controllers/versionController.js');
// router.post('/api/version', version.getVersion);

const authController = require('../controllers/authController.js');
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.post('/api/verify-email', authController.verifyEmail);

const otpController = require('../controllers/otpController.js');
router.post('/api/resend-otp', otpController.resendOtp);
 
const user = require('../controllers/userController.js');
router.get('/api/user', user.getUser);
router.get('/api/user/detail', auth.verifyToken, user.getUserDetail);
router.post('/api/user/update', auth.verifyToken, user.updateUser);
router.post('/api/user/update-password', auth.verifyToken, user.updatePassword);
router.post('/api/user/delete', auth.verifyToken, user.deleteUser);

const question = require('../controllers/questionController.js');
router.get('/api/question', auth.verifyToken, question.getAllQuestions);
router.get('/api/my-question', auth.verifyToken, question.getUserQuestions);
router.post('/api/question/create', auth.verifyToken, question.createQuestion);

// const uploadController = require("../controllers/uploadController.js");
// router.post("/api/upload", auth.verifyToken, upload.single("file"), uploadController.upload);

module.exports = router;