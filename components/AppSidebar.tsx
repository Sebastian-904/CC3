import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Building,
  FileText,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GanttChartSquare
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';

interface AppSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, setIsOpen }) => {
    const { t } = useLanguage();
    const { user } = useAuth();

    const navItems = [
      { to: '/dashboard', icon: LayoutDashboard, label: t('sidebarDashboard') },
      { to: '/company-profile', icon: Building, label: t('sidebarCompanyProfile') },
      { to: '/obligations', icon: FileText, label: t('sidebarObligations') },
      { to: '/reports', icon: BarChart2, label: t('sidebarReports') },
      { to: '/users', icon: Users, label: t('sidebarUsers'), roles: ['admin', 'consultor'] },
      { to: '/library', icon: BookOpen, label: t('sidebarLibrary') },
    ];

    const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role || ''));

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-40 hidden h-full flex-col border-r bg-card transition-all duration-300 lg:flex",
            { 'w-64': isOpen },
            { 'w-16': !isOpen }
        )}>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <a href="#/" className="flex items-center gap-2 font-semibold">
                    <GanttChartSquare className="h-6 w-6 text-primary" />
                    {isOpen && <span className="">CompliancePro</span>}
                </a>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8 hidden" onClick={() => setIsOpen(!isOpen)}>
                   {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 text-sm font-medium lg:px-4 py-4">
                <ul className="space-y-1">
                    {filteredNavItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                                    { 'bg-accent text-primary': isActive },
                                    { 'justify-center': !isOpen }
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {isOpen && item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto p-4 border-t">
                 <ul className="space-y-1">
                     <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                                { 'bg-accent text-primary': isActive },
                                { 'justify-center': !isOpen }
                            )}
                        >
                            <Settings className="h-4 w-4" />
                            {isOpen && t('sidebarSettings')}
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                            to="/quick-start"
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                                { 'bg-accent text-primary': isActive },
                                { 'justify-center': !isOpen }
                            )}
                        >
                            <HelpCircle className="h-4 w-4" />
                            {isOpen && t('sidebarQuickStart')}
                        </NavLink>
                     </li>
                 </ul>
            </div>
        </aside>
    );
};

export default AppSidebar;