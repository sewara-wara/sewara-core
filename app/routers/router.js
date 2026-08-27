const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.js");
const { authLimiter, getLimiter } = require('../middlewares/rateLimiter');
// const upload = require("../middleware/upload.js");

// const version = require('../controllers/versionController.js');
// router.post('/api/version', version.getVersion);

const authController = require('../controllers/authController.js');
router.post('/login', authLimiter, authController.login);
// router.post('/register', authController.register);
// router.post('/verify-email', authController.verifyEmail);

// const otpController = require('../controllers/otpController.js');
// router.post('/api/resend-otp', otpController.resendOtp);
 
// const user = require('../controllers/userController.js');
// router.get('/user', user.getUser);
// router.get('/user/detail', auth.verifyToken, user.getUserDetail);
// router.post('/user/update', auth.verifyToken, user.updateUser);
// router.post('/user/update-password', auth.verifyToken, user.updatePassword);
// router.delete('/user/delete', auth.verifyToken, user.deleteUser);

// const post = require('../controllers/postController.js');
// router.post('/api/post', auth.verifyToken, post.createPost);
// router.get('/api/post', getLimiter, post.getAllPosts);
// router.get('/api/my-post', getLimiter, auth.verifyToken, post.getUserPosts);
// router.put('/api/post/:postId', auth.verifyToken, post.updatePost);
// router.delete('/api/post/:postId', auth.verifyToken, post.deletePost);

// const comment = require('../controllers/commentController.js');
// router.post('/api/post/:postId/comment', auth.verifyToken, comment.createComment);
// router.get('/api/post/:postId/comment', getLimiter, comment.getCommentsByPost);
// router.get('/api/my-comment', getLimiter, comment.getUserComments);
// router.put('/api/comment/:commentId', auth.verifyToken, comment.updateComment);
// router.delete('/api/comment/:commentId', auth.verifyToken, comment.deleteComment);

// const uploadController = require("../controllers/uploadController.js");
// router.post("/api/upload", auth.verifyToken, upload.single("file"), uploadController.upload);

module.exports = router;