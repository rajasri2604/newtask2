import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import API from '../api/api';
import 'react-calendar/dist/Calendar.css';

export default function AttendanceHistory() {
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get('/attendance/History');
      // Assuming API returns data like: { "2025-11-01": "Present", "2025-11-02": "Absent" }
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const tileClassName = ({ date, view }) => {
    const key = date.toISOString().split('T')[0];
    if (view === 'month' && attendance[key]) {
      switch (attendance[key]) {
        case 'Present': return 'bg-green-400 text-white rounded';
        case 'Absent': return 'bg-red-400 text-white rounded';
        case 'Late': return 'bg-yellow-400 text-black rounded';
        case 'Half Day': return 'bg-orange-400 text-white rounded';
        default: return null;
      }
    }
    return null;
  };

  const onClickDate = (date) => {
    const key = date.toISOString().split('T')[0];
    alert(`Status on ${key}: ${attendance[key] || 'No data'}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
      <Calendar
        value={selectedDate}
        onClickDay={onClickDate}
        tileClassName={tileClassName}
      />
    </div>
  );
}
