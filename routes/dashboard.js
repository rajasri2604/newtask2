const express = require('express');
const router = express.Router();
const dashCtrl = require('../controllers/dashboardController');
const { auth, managerOnly } = require('../middleware/authMiddleware');

router.get('/employee', auth, dashCtrl.employeeDashboard);
router.get('/manager', auth, managerOnly, dashCtrl.managerDashboard);

module.exports = router;
