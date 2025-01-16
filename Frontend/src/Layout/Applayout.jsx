import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const Applayout = () => {
  const userType = "patient"; 
  const location = useLocation();

  const hasAccess = (pathname) => {
    const path = pathname.split('/')[1]; 
    return path === userType;
  };

  if (!hasAccess(location.pathname)) {
    return <Navigate to={`/${userType}`} replace />;
  }

  return (
    <div className="app-container">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Applayout;