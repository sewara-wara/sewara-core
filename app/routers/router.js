const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.js");
const { authLimiter, getLimiter } = require('../middlewares/rateLimiter');
// const upload = require("../middleware/upload.js");

// const version = require('../controllers/versionController.js');
// router.post('/api/version', version.getVersion);

const authController = require('../controllers/authController.js');
router.post('/api/login', authLimiter, authController.login);
router.post('/api/register', authController.register);
router.post('/api/verify-email', authController.verifyEmail);

const otpController = require('../controllers/otpController.js');
router.post('/api/resend-otp', otpController.resendOtp);
 
const user = require('../controllers/userController.js');
router.get('/api/user', user.getUser);
router.get('/api/user/detail', auth.verifyToken, user.getUserDetail);
router.post('/api/user/update', auth.verifyToken, user.updateUser);
router.post('/api/user/update-password', auth.verifyToken, user.updatePassword);
router.delete('/api/user/delete', auth.verifyToken, user.deleteUser);

const post = require('../controllers/postController.js');
router.post('/api/post', auth.verifyToken, post.createPost);
router.get('/api/post', getLimiter, post.getAllPosts);
router.get('/api/my-post', auth.verifyToken, post.getUserPosts);
router.put('/api/post/:postId', auth.verifyToken, post.updatePost);
router.delete('/api/post/:postId', auth.verifyToken, post.deletePost);

// const uploadController = require("../controllers/uploadController.js");
// router.post("/api/upload", auth.verifyToken, upload.single("file"), uploadController.upload);

module.exports = router;