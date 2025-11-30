import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { CSVLink } from 'react-csv';

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get('/employees');
    setEmployees(res.data);
  };

  const fetchReport = async () => {
    const res = await API.get('/attendance/report', {
      params: {
        employee: selectedEmployee,
        from: dateRange.from,
        to: dateRange.to
      }
    });
    setData(res.data);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Attendance Reports</h2>

      <div className="flex gap-4 mb-4">
        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} />
        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} />
        <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
          <option value="all">All Employees</option>
          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
        </select>
        <button onClick={fetchReport} className="bg-blue-600 text-white px-4 rounded">Show</button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.date}</td>
              <td className="border p-2">{row.employeeName}</td>
              <td className="border p-2">{row.status}</td>
              <td className="border p-2">{row.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > 0 && (
        <CSVLink data={data} filename="attendance_report.csv" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
          Export to CSV
        </CSVLink>
      )}
    </div>
  );
}
