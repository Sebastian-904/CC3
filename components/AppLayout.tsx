import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { cn } from '../lib/utils';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-secondary/50 dark:bg-background">
            <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={cn(
                "flex flex-1 flex-col transition-all duration-300",
                { 'lg:ml-64': isSidebarOpen },
                { 'lg:ml-16': !isSidebarOpen }
            )}>
                <AppHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
