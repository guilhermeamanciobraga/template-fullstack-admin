const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

routes.use(authMiddleware);

routes.get('/users', userController.index);
routes.post('/users', userController.store);
routes.patch('/users/:id/status', userController.updateStatus);
routes.patch('/users/:id/password', userController.updatePassword);
routes.delete('/users/:id', userController.delete);

module.exports = routes;