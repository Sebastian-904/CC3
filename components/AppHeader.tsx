
import React, { useState, useRef } from 'react';
import { Menu, Search } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { useAuth } from '../hooks/useAuth';
import useOnClickOutside from '../hooks/useOnClickOutside';
import NotificationsMenu from './NotificationsMenu';
import { useTheme } from '../hooks/useTheme';

interface AppHeaderProps {
    onMenuClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value as 'light' | 'dark' | 'system');
    };

    return (
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <div className="w-full flex-1">
                {/* Search can be added here if needed */}
            </div>
            <div className="flex items-center gap-2">
                <NotificationsMenu />
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center justify-center h-9 w-9 rounded-full bg-secondary text-secondary-foreground font-semibold"
                    >
                        {user?.displayName?.charAt(0).toUpperCase()}
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95">
                            <div className="py-1">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                                <div className="px-4 py-2">
                                    <label htmlFor="theme-select" className="text-xs text-muted-foreground">Theme</label>
                                    <select 
                                      id="theme-select" 
                                      value={theme}
                                      onChange={handleThemeChange}
                                      className="mt-1 block w-full rounded-md border-input bg-background h-8 px-2 text-sm"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
