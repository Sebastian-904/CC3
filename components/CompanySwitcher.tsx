

import React, { useState, useEffect, useRef } from 'react';
import { Building, ChevronsUpDown, Check, Loader2, PlusCircle } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getAvailableCompanies } from '../services/firebaseService';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useApp } from '../hooks/useApp';
import { cn } from '../lib/utils';
import CreateCompanyDialog from './consultant-dashboard/CreateCompanyDialog';

interface Company {
    id: string;
    name: string;
}

const CompanySwitcher: React.FC = () => {
    const { user, switchCompany } = useAuth();
    const { activeCompany, loading: appLoading } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(switcherRef, () => setIsOpen(false));

    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const availableCompanies = await getAvailableCompanies();
                setCompanies(availableCompanies);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (user?.role === 'admin' || user?.role === 'consultor') {
            fetchCompanies();
        } else {
            setIsLoading(false);
        }
    }, [user]);
    
    const handleSwitch = (companyId: string) => {
        if (user?.companyId !== companyId) {
            switchCompany(companyId);
        }
        setIsOpen(false);
    };

    if (appLoading || !activeCompany) {
        return (
            <Button variant="outline" className="w-full md:w-[250px] justify-start" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="truncate">Loading Company...</span>
            </Button>
        );
    }

    return (
        <div className="relative" ref={switcherRef}>
            <Button
                variant="outline"
                className="w-full md:w-[250px] justify-between"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {isLoading ? (
                         <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                    ) : (
                         <Building className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{isLoading ? 'Loading...' : activeCompany.name}</span>
                </div>
                {!isLoading && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
            </Button>
            {isOpen && !isLoading && (
                 <div className="absolute z-50 mt-2 w-full md:w-[250px] rounded-md shadow-lg bg-card border ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95">
                     <div className="py-1">
                        {companies.map(company => (
                             <button
                                key={company.id}
                                onClick={() => handleSwitch(company.id)}
                                className={cn(
                                    "flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-accent",
                                    user?.companyId === company.id && "bg-accent"
                                )}
                            >
                                <span className="truncate">{company.name}</span>
                                {user?.companyId === company.id && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                         <div className="my-1 h-px bg-border" />
                        <button
                            onClick={() => { setIsOpen(false); setIsCreateOpen(true); }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-primary hover:bg-accent"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Company
                        </button>
                    </div>
                 </div>
            )}
            <CreateCompanyDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
};

export default CompanySwitcher;