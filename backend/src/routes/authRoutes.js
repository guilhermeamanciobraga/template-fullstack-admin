const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadConfig = require('../config/upload');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer(uploadConfig);

router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.patch('/avatar', authMiddleware, upload.single('avatar'), authController.updateAvatar);

router.patch('/admin/users/:id/password', authMiddleware, authController.updateUserPassword);

module.exports = router;