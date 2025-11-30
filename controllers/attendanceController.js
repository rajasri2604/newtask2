const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

const todayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

exports.checkIn = async (req, res) => {
  try {
    const date = todayStr();
    const userId = req.user.id;
    // If already checked in today, return existing
    let att = await Attendance.findOne({ userId, date });
    const now = new Date();
    const time = now.toISOString();
    if (att) {
      if (att.checkInTime) return res.status(400).json({ message: 'Already checked in' });
      att.checkInTime = time;
    } else {
      att = new Attendance({ userId, date, checkInTime: time, status: 'present' });
    }
    await att.save();
    res.json(att);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const date = todayStr();
    const userId = req.user.id;
    let att = await Attendance.findOne({ userId, date });
    if (!att || !att.checkInTime) return res.status(400).json({ message: 'Not checked in yet' });

    if (att.checkOutTime) return res.status(400).json({ message: 'Already checked out' });

    const now = new Date();
    const inTime = new Date(att.checkInTime);
    const diffMs = now - inTime;
    const hours = diffMs / (1000 * 60 * 60);
    att.checkOutTime = now.toISOString();
    att.totalHours = Number(hours.toFixed(2));

    // simple late detection (if check-in after 09:30 local time)
    const inLocal = inTime;
    if (inLocal.getHours() > 9 || (inLocal.getHours() === 9 && inLocal.getMinutes() > 30)) {
      att.status = 'late';
    }

    await att.save();
    res.json(att);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.mySummary = async (req, res) => {
  try {
    const month = req.query.month; // format: YYYY-MM
    const match = { userId: req.user.id };
    if (month) {
      match.date = { $regex: `^${month}` }; // matches 'YYYY-MM'
    }
    const records = await Attendance.find(match);
    const summary = { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 };
    records.forEach(r => {
      if (r.status === 'present') summary.present++;
      if (r.status === 'absent') summary.absent++;
      if (r.status === 'late') summary.late++;
      if (r.status === 'half-day') summary.halfDay++;
      summary.totalHours += r.totalHours || 0;
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.todayStatus = async (req, res) => {
  try {
    const date = todayStr();
    const att = await Attendance.findOne({ userId: req.user.id, date });
    res.json({ date, attendance: att });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager endpoints
exports.allAttendance = async (req, res) => {
  try {
    const { date, employeeId, status } = req.query;
    const q = {};
    if (date) q.date = date;
    if (status) q.status = status;
    let records = await Attendance.find(q).populate('userId', 'name email employeeId department').sort({ date: -1 });
    if (employeeId) {
      records = records.filter(r => r.userId.employeeId === employeeId);
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.employeeAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Attendance.find({ userId: id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.summary = async (req, res) => {
  try {
    // Aggregate team summary: total employees, present today, absent today, late today
    const date = req.query.date || todayStr();
    const users = await User.countDocuments();
    const present = await Attendance.countDocuments({ date, checkInTime: { $exists: true } });
    const late = await Attendance.countDocuments({ date, status: 'late' });
    const absent = users - present;
    res.json({ date, totalEmployees: users, present, absent, late });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { from, to } = req.query; // from=YYYY-MM-DD&to=YYYY-MM-DD
    const q = {};
    if (from && to) q.date = { $gte: from, $lte: to };
    const records = await Attendance.find(q).populate('userId', 'name email employeeId department');

    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '..', 'seed', 'attendance_export.csv'),
      header: [
        { id: 'employeeId', title: 'Employee ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'department', title: 'Department' },
        { id: 'date', title: 'Date' },
        { id: 'checkInTime', title: 'Check In' },
        { id: 'checkOutTime', title: 'Check Out' },
        { id: 'status', title: 'Status' },
        { id: 'totalHours', title: 'Total Hours' }
      ]
    });

    const data = records.map(r => ({
      employeeId: r.userId.employeeId,
      name: r.userId.name,
      email: r.userId.email,
      department: r.userId.department,
      date: r.date,
      checkInTime: r.checkInTime || '',
      checkOutTime: r.checkOutTime || '',
      status: r.status,
      totalHours: r.totalHours || 0
    }));

    await csvWriter.writeRecords(data);
    res.download(path.join(__dirname, '..', 'seed', 'attendance_export.csv'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
