import React, { useState } from 'react';
import API from '../api/api';

export default function Attendance() {
  const [msg, setMsg] = useState('');

  const checkIn = async () => {
    try {
      const res = await API.post('/attendance/checkin');
      setMsg('Checked in at ' + new Date(res.data.checkInTime).toLocaleString());
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const checkOut = async () => {
    try {
      const res = await API.post('/attendance/checkout');
      setMsg('Checked out. Total hours: ' + res.data.totalHours);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded shadow bg-white dark:bg-[#4c0f75] dark:text-white">
     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Check In/Out</h2>

        <div className="flex gap-4">  
    <button  
      onClick={checkIn}  
      className="flex-1 p-3 rounded bg-green-600 text-white dark:bg-green-500 dark:text-black hover:bg-green-700 dark:hover:bg-green-400 transition-colors duration-200"  
    >  
      Check In  
    </button>  
    <button  
      onClick={checkOut}  
      className="flex-1 p-3 rounded bg-red-600 text-white dark:bg-red-500 dark:text-black hover:bg-red-700 dark:hover:bg-red-400 transition-colors duration-200"  
    >  
      Check Out  
    </button>  
  </div>  

  {msg && (  
    <div className="mt-4 p-3 rounded bg-gray-100 dark:bg-purple-900 text-gray-800 dark:text-white transition-colors duration-300">  
      {msg}  
    </div>  
  )}  
</div>  

  );
}
