import React, { useState, useRef } from 'react';
import { Menu, User, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Button from './ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';
import NotificationsMenu from './NotificationsMenu';

interface AppHeaderProps {
  onMenuClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      {/* The problematic spacer div was removed and ml-auto was added to the next div to push it to the right */}
      <div className="flex items-center gap-2 ml-auto">
          <NotificationsMenu />
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="relative" ref={userMenuRef}>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
              </Button>
              {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border text-popover-foreground animate-in fade-in-0 zoom-in-95">
                      <div className="p-2 border-b">
                          <p className="text-sm font-medium">{user?.displayName}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <nav className="p-1">
                          <button onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                              <Settings className="h-4 w-4" />
                              <span>{t('settings')}</span>
                          </button>
                           <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                              <LogOut className="h-4 w-4" />
                              <span>{t('logout')}</span>
                          </button>
                      </nav>
                  </div>
              )}
          </div>
      </div>
    </header>
  );
};

export default AppHeader;