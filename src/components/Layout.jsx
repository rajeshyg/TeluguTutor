import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap');
        
        :root {
          --color-primary: #9333ea;
          --color-secondary: #ec4899;
          --color-accent: #f59e0b;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
      
      <div className="min-h-screen">
        <Outlet />
      </div>
    </>
  );
}