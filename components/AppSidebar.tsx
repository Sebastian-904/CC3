import React from 'react';
import { NavLink } from 'react-router-dom';
import { GanttChartSquare, LayoutDashboard, Building, FileText, Settings, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import Button from './ui/Button';

const AppSidebar = () => {
    const { companies, activeCompany, setActiveCompanyId } = useApp();
    const { theme, setTheme } = useTheme();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/company-profile', label: 'Company Profile', icon: Building },
        { href: '/obligations', label: 'Obligations', icon: ShieldCheck },
        { href: '/reports', label: 'Reports', icon: FileText },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];
    
    return (
        <aside className="hidden w-64 flex-col border-r bg-card p-4 sm:flex">
            <div className="mb-6 flex items-center gap-2">
                <GanttChartSquare className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold">CompliancePro</span>
            </div>
            
            <div className="mb-4">
                <label htmlFor="company-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Company
                </label>
                <select
                    id="company-select"
                    value={activeCompany?.id || ''}
                    onChange={(e) => setActiveCompanyId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-input bg-background py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    disabled={companies.length === 0}
                >
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )
                        }
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            
            <div className="mt-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Theme</p>
                <div className="grid grid-cols-3 gap-1 rounded-md bg-secondary p-1">
                    <Button variant={theme === 'light' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('light')} className={cn('flex-1 justify-center', {'bg-white text-black shadow-sm': theme === 'light'})}>
                        <Sun className="h-4 w-4" />
                    </Button>
                     <Button variant={theme === 'dark' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('dark')} className={cn('flex-1 justify-center', {'dark:bg-primary dark:text-primary-foreground': theme === 'dark'})}>
                        <Moon className="h-4 w-4" />
                    </Button>
                    <Button variant={theme === 'system' ? 'default' : 'ghost'} size="sm" onClick={() => setTheme('system')} className="flex-1 justify-center">
                        <Monitor className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default AppSidebar;