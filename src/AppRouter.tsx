import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login'; // Import the Login component
import Dashboard from './Dashboard'; // Import the Dashboard component

const AppRouter: React.FC = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // On initial load, check the login status from localStorage
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  return (
    <Routes>
      {/* Default route: Login page */}
      <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      
      {/* Protected route for Dashboard */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRouter;
