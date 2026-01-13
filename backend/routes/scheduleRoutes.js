const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// 日程調整
router.post('/', scheduleController.create);
router.get('/:family_id', scheduleController.list);

module.exports = router;
