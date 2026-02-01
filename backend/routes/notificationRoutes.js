const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// 通知統合エンドポイント
router.get('/:family_id', notificationController.getNotifications);

module.exports = router;
