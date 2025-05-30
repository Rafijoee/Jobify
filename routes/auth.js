const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const multer = require('../utils/multer');
const middlewares = require('../middlewares/restrict');

router.post('/register', multer.single('avatar'),  AuthController.register,);
router.post('/login', AuthController.login);
router.put('/change-password', middlewares.user, AuthController.changePassword);
router.put('/change-profile',multer.single('avatar'), middlewares.user, AuthController.changeProfile);
router.delete('/delete-account/:id',middlewares.admin,  AuthController.delete);
router.get('/users',middlewares.admin, AuthController.getAllUser);
router.get('/user/:id',middlewares.admin, AuthController.getById);

module.exports = router;