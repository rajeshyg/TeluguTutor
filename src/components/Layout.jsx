import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createPageUrl } from '@/utils';

export default function Layout() {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(createPageUrl('Login'));
  };

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
      
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span>{user.name || user.email}</span>
                {isGuest && <span className="text-xs">(Guest)</span>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </>
  );
}