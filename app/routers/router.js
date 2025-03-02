const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.js");
// const upload = require("../middleware/upload.js");

// const version = require('../controllers/versionController.js');
// router.post('/api/version', version.getVersion);

const authController = require('../controllers/authController.js');
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.post('/api/verify-email', authController.verifyEmail);
 
const user = require('../controllers/userController.js');
router.get('/api/users', user.getUsers);

// const uploadController = require("../controllers/uploadController.js");
// router.post("/api/upload", auth.verifyToken, upload.single("file"), uploadController.upload);

module.exports = router;