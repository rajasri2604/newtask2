import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [data, setData] = useState({
    present: 0,
    absent: 0,
    totalHours: 0,
    recent: [],
    totalEmployees: 0,
    late: 0
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/dashboard/${user.role === 'manager' ? 'manager' : 'employee'}`);
        setData({
          ...data,
          ...res.data,
          recent: res.data?.recent || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (user && user.role) load();
  }, [user]);

  if (!user.role) return <div>Loading...</div>;

  // 🌙 DARK MODE CARD FIX
  const cardClass =
    "p-4 rounded shadow " +
    "bg-white text-purple-900 " +                          // Light theme
    "dark:bg-purple-300 dark:text-purple-900";            // Dark theme FIXED

  // MANAGER
  if (user.role === "manager") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className={cardClass}>
          <h3 className="font-semibold">Total Employees</h3>
          <p className="text-2xl">{data.totalEmployees}</p>
        </div>

        <div className={cardClass}>
          <h3 className="font-semibold">Today's Present</h3>
          <p className="text-2xl">{data.present}</p>
        </div>

        <div className={cardClass}>
          <h3 className="font-semibold">Late Today</h3>
          <p className="text-2xl">{data.late}</p>
        </div>

      </div>
    );
  }

  // EMPLOYEE VIEW
  return (
    <div>
      <h2 className="text-xl font-semibold">Employee Dashboard</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className={cardClass}>
          <div className="text-sm">This month - Present</div>
          <div className="text-2xl">{data.present}</div>
        </div>

        <div className={cardClass}>
          <div className="text-sm">This month - Absent</div>
          <div className="text-2xl">{data.absent}</div>
        </div>

        <div className={cardClass}>
          <div className="text-sm">Total Hours This Month</div>
          <div className="text-2xl">{data.totalHours}</div>
        </div>

      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Recent Attendance</h3>
        <ul className="mt-2 space-y-2">
          {(data.recent || []).map(r => (
            <li
              key={r._id}
              className={
                "p-3 rounded shadow flex justify-between " +
                "bg-white text-purple-900 " +
                "dark:bg-purple-300 dark:text-purple-900"   // FIXED
              }
            >
              <div>{r.date}</div>
              <div>{r.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
