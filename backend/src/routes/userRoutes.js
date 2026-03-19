const express = require('express');
const routes = express.Router();
const multer = require('multer');
const uploadConfig = require('../config/upload');
const userController = require('../controllers/userController');
const systemImageController = require('../controllers/SystemImageController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer(uploadConfig);

routes.get('/system-images', systemImageController.index);

routes.use(authMiddleware);

routes.get('/users', userController.index);
routes.post('/users', userController.store);
routes.patch('/users/:id/status', userController.updateStatus);
routes.patch('/users/:id/role', userController.updateRole);
routes.patch('/users/:id/password', userController.updatePassword);
routes.delete('/users/:id', userController.delete);

routes.post('/system-images/:type', upload.single('file'), systemImageController.store);

module.exports = routes;