import React from 'react';
import { useLocation } from 'react-router-dom';
import LayoutHeader from './layout.header';
// import LayoutFooter from './layout.footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>; // Ensure to return JSX here
  }

  return (
    <>
      <LayoutHeader />
      {children}
      {/* <LayoutFooter /> */}
    </>
  );
};

export default Layout;
