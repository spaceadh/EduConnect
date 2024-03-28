// Layout.js

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === '/home') {
      document.body.classList.add('home-route');
    } else if (pathname === '/register' || pathname === '/forgot-password' || pathname === '/AddLecturerPage') {
      document.body.classList.add('auth-route');
    }

    return () => {
      document.body.classList.remove('home-route', 'auth-route');
    };
  }, [location.pathname]);

  return <div>{children}</div>;
};

export default Layout;
