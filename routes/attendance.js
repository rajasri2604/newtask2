const express = require('express');
const router = express.Router();
const attCtrl = require('../controllers/attendanceController');
const { auth, managerOnly } = require('../middleware/authMiddleware');

console.log("Attendance routes loaded");

router.post('/checkin', auth, attCtrl.checkIn);
router.post('/checkout', auth, attCtrl.checkOut);
router.get('/my-history', auth, attCtrl.myHistory);
router.get('/my-summary', auth, attCtrl.mySummary);
router.get('/today', auth, attCtrl.todayStatus);

// Manager routes
router.get('/all', auth, managerOnly, attCtrl.allAttendance);
router.get('/employee/:id', auth, managerOnly, attCtrl.employeeAttendance);
router.get('/summary', auth, managerOnly, attCtrl.summary);
router.get('/export', auth, managerOnly, attCtrl.exportCSV);

module.exports = router;
