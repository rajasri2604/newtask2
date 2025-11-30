const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.employeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date();
    const month = date.toISOString().slice(0,7); // YYYY-MM
    const thisMonthRecords = await Attendance.find({ userId, date: { $regex: `^${month}` } });

    const present = thisMonthRecords.filter(r => r.status === 'present').length;
    const absent = thisMonthRecords.filter(r => r.status === 'absent').length;
    const late = thisMonthRecords.filter(r => r.status === 'late').length;
    const totalHours = thisMonthRecords.reduce((s, r) => s + (r.totalHours || 0), 0);

    const today = date.toISOString().split('T')[0];
    const todayRec = await Attendance.findOne({ userId, date: today });

    const recent = await Attendance.find({ userId }).sort({ date: -1 }).limit(7);

    res.json({
      todayStatus: todayRec ? 'Checked In' : 'Not Checked In',
      present, absent, late, totalHours,
      recent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.managerDashboard = async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const totalEmployees = await User.countDocuments();
    const present = await Attendance.countDocuments({ date, checkInTime: { $exists: true } });
    const late = await Attendance.countDocuments({ date, status: 'late' });
    // basic weekly trend (last 7 days)
    const trend = [];
    for (let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const cnt = await Attendance.countDocuments({ date: ds, checkInTime: { $exists: true } });
      trend.push({ date: ds, present: cnt });
    }
    res.json({ date, totalEmployees, present, late, trend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
