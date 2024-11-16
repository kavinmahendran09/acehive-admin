import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login'; // Import the Login component
import Dashboard from './Dashboard'; // Import the Dashboard component

const AppRouter: React.FC = () => {
  // Check if the user is logged in (using localStorage in this case)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  console.log('Is user logged in:', isLoggedIn); // Debugging log

  return (
    <Routes>
      {/* Default route: Login page */}
      <Route path="/" element={<Login />} />
      
      {/* Protected route for Dashboard */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRouter;
