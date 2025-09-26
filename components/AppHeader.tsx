import React from 'react';
import { Menu } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import NotificationsMenu from './NotificationsMenu';

const AppHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    {/* Placeholder for search or other actions */}
                </div>
                <NotificationsMenu />
                <div className="flex items-center gap-2">
                     <div className="flex flex-col items-end text-sm">
                        <span className="font-semibold">{user?.displayName}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                    <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">Logout</Button>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
