import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`min-h-screen transition-all duration-500 
      ${theme === "dark" ? "bg-[#3b0a58] text-white" : "bg-purple-100 text-purple-900"}`}>

     <nav className={`nav-animated shadow p-4 flex justify-between items-center transition-all duration-500
  ${theme === "dark" ? "dark:bg-[#7326b6] text-white" : "bg-purple-300 text-purple-900"}
`}>

        <div className="font-bold text-lg">AttendanceApp</div>

        <div className="space-x-6 flex items-center font-semibold">

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/history">My History</Link>
         

                <button  
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}  
        className="p-2 rounded-full bg-purple-400 dark:bg-purple-700 hover:scale-110 transition"  
      >  
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />  
      </button>  

      <button className="text-red-600 dark:text-red-300" onClick={logout}>  
        Logout  
      </button>  
    </div>  
  </nav>  

  <main className="p-6"> 
     
    <Outlet />  
  </main>  
</div>  

  );
}
