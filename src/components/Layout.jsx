import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

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
      
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </>
  );
}