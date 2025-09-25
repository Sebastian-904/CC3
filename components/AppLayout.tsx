
import React from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-secondary/50 dark:bg-background">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
