const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ユーザー認証・登録
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:email', userController.getUserInfo);

module.exports = router;
