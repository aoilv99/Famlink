const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

// 家族管理
router.post('/create', familyController.create);
router.post('/join', familyController.join);
router.post('/leave', familyController.leave);

module.exports = router;
