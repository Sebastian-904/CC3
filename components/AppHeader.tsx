import React, { useState, useRef } from 'react';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import Button from './ui/Button';
import useOnClickOutside from '../hooks/useOnClickOutside';
import NotificationsMenu from './NotificationsMenu';
import { useLanguage } from '../hooks/useLanguage';

interface AppHeaderProps {
    onMenuClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { activeCompany } = useApp();
    const { t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setMenuOpen(false));

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1">
                <h1 className="text-xl font-semibold truncate">{activeCompany?.name || t('dashboard')}</h1>
            </div>
            <div className="flex items-center gap-2">
                <NotificationsMenu />
                <div className="relative" ref={menuRef}>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
                        <img
                            src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.uid}`}
                            alt="User avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    </Button>
                    {menuOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border ring-1 ring-black ring-opacity-5 animate-in fade-in-0 zoom-in-95"
                        >
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <div className="px-4 py-2 text-sm text-foreground">
                                    <p className="font-semibold truncate">{user?.displayName}</p>
                                    <p className="text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <div className="border-t border-border"></div>
                                <a href="#/settings" onClick={() => setMenuOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>{t('myProfile')}</span>
                                </a>
                                <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t('logout')}</span>
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
