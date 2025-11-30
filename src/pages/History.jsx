import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function History() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await API.get('/attendance/my-history');
      setRows(res.data);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Attendance History</h2>

        <div className="overflow-auto rounded shadow bg-white dark:bg-[#4c0f75] transition-colors duration-300">  
    <table className="w-full border-collapse">  
      <thead className="bg-gray-100 dark:bg-purple-900 text-gray-800 dark:text-white">  
        <tr>  
          <th className="p-2 border-b border-gray-300 dark:border-purple-700 text-left">Date</th>  
          <th className="p-2 border-b border-gray-300 dark:border-purple-700 text-left">Check In</th>  
          <th className="p-2 border-b border-gray-300 dark:border-purple-700 text-left">Check Out</th>  
          <th className="p-2 border-b border-gray-300 dark:border-purple-700 text-left">Status</th>  
          <th className="p-2 border-b border-gray-300 dark:border-purple-700 text-left">Hours</th>  
        </tr>  
      </thead>  

      <tbody>  
        {rows.map(r => (  
          <tr key={r._id} className="border-b border-gray-200 dark:border-purple-700 text-gray-800 dark:text-white">  
            <td className="p-2">{r.date}</td>  
            <td className="p-2">{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>  
            <td className="p-2">{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>  
            <td className="p-2">{r.status}</td>  
            <td className="p-2">{r.totalHours}</td>  
          </tr>  
        ))}  
      </tbody>  

    </table>  
  </div>  
</div>  

  );
}
