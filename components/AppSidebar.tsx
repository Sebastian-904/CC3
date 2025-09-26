import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GanttChartSquare, LayoutDashboard, Building, FileText, BarChart2, Users, Settings, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

interface AppSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, setIsOpen }) => {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { user } = useAuth();
    
    const canManageUsers = user?.role === 'admin' || user?.role === 'consultor';

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard'), visible: true },
        { to: '/company-profile', icon: Building, label: t('companyProfile'), visible: true },
        { to: '/obligations', icon: FileText, label: t('obligationsMatrix'), visible: true },
        { to: '/reports', icon: BarChart2, label: t('reports'), visible: true },
        { to: '/users', icon: Users, label: t('users'), visible: canManageUsers },
        { to: '/settings', icon: Settings, label: t('settings'), visible: true },
    ];

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-40 h-screen border-r bg-card text-card-foreground transition-all duration-300",
            "hidden lg:flex flex-col",
            isOpen ? 'w-64' : 'w-16'
        )}>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <a href="#/" className="flex items-center gap-2 font-semibold">
                    <GanttChartSquare className="h-6 w-6 text-primary" />
                    {isOpen && <span className="">CompliancePro</span>}
                </a>
            </div>
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 text-sm font-medium lg:px-4 py-4 space-y-1">
                {navItems.filter(item => item.visible).map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            { 'bg-accent text-primary': isActive },
                            !isOpen && 'justify-center'
                        )}
                        title={isOpen ? undefined : item.label}
                    >
                        <item.icon className="h-4 w-4" />
                        {isOpen && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto p-4 border-t">
                <div className={cn("flex items-center justify-center gap-4", !isOpen && 'flex-col gap-2')}>
                    <div className="flex">
                        <button onClick={() => setTheme('light')} className={cn("p-2 rounded-l-md", theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <Sun className="h-4 w-4" />
                        </button>
                         <button onClick={() => setTheme('dark')} className={cn("p-2 rounded-r-md", theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <Moon className="h-4 w-4" />
                        </button>
                    </div>
                     <div className="flex">
                         <button onClick={() => setLanguage('es')} className={cn("px-3 py-2 rounded-l-md text-xs", language === 'es' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            ES
                        </button>
                         <button onClick={() => setLanguage('en')} className={cn("px-3 py-2 rounded-r-md text-xs", language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            EN
                        </button>
                    </div>
                </div>
            </div>
             <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="absolute -right-3 top-16 hidden lg:flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground border-2 border-background"
             >
                {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
        </aside>
    );
};

export default AppSidebar;