const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const scheduleResponseController = require('../controllers/scheduleResponseController');

// 日程調整
router.post('/', scheduleController.create);
router.get('/:family_id', scheduleController.list);

// 日程調整への回答
router.post('/:schedule_id/responses', scheduleResponseController.saveResponse);
router.get('/:schedule_id/responses', scheduleResponseController.getResponses);
router.get('/:schedule_id/final', scheduleResponseController.getFinalSchedule);

// 親が最終日程を選択
router.post('/:schedule_id/select', scheduleController.selectFinalSlot);

module.exports = router;
