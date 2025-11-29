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
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
      
      <div className="flex flex-col w-full h-full bg-background text-foreground transition-colors duration-300">
        <header className="w-full bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">Telugu Tutor</h1>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <Outlet />
        </main>
      </div>
    </>
  );
}