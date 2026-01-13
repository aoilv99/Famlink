const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// メッセージ管理
router.post('/', messageController.postMessage);
router.get('/:family_id', messageController.getMessages);

module.exports = router;
