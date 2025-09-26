
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    Company, CalendarEvent, Obligation, UserProfile, Notification, TaskCategory, ComplianceDocument, AIExtractedCompany
} from '../lib/types';
import { useAuth } from '../hooks/useAuth';
import { getMockDataForUser } from '../services/firebaseService';

interface AppContextType {
    loading: boolean;
    activeCompany: Company | null;
    companyUsers: UserProfile[];
    events: CalendarEvent[];
    obligations: Obligation[];
    notifications: Notification[];
    taskCategories: TaskCategory[];
    complianceDocuments: ComplianceDocument[];
    importedCompanyData: AIExtractedCompany | null;
    addEvent: (event: Omit<CalendarEvent, 'id' | 'companyId'>) => Promise<void>;
    updateEvent: (event: CalendarEvent) => Promise<void>;
    updateCompany: (company: Company) => Promise<void>;
    addObligation: (obligation: Omit<Obligation, 'id' | 'companyId' | 'status'>) => Promise<void>;
    deleteObligation: (id: string) => Promise<void>;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    addNewComplianceDocument: (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => Promise<void>;
    deleteComplianceDocument: (id: string) => Promise<void>;
    setImportedCompanyData: (data: AIExtractedCompany | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [complianceDocuments, setComplianceDocuments] = useState<ComplianceDocument[]>([]);
    const [importedCompanyData, setImportedCompanyData] = useState<AIExtractedCompany | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                setLoading(true);
                const data = await getMockDataForUser(user.uid);
                setActiveCompany(data.company);
                setCompanyUsers(data.companyUsers);
                setEvents(data.events);
                setObligations(data.obligations);
                setNotifications(data.notifications);
                setTaskCategories(data.taskCategories);
                setComplianceDocuments(data.complianceDocuments);
                setLoading(false);
            } else {
                // Clear data on logout
                setLoading(false);
                setActiveCompany(null);
                setEvents([]);
            }
        };
        loadData();
    }, [user]);

    const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        if (!activeCompany) return;
        const newEvent: CalendarEvent = {
            ...event,
            id: `evt-${Date.now()}`,
            companyId: activeCompany.id,
        };
        setEvents(prev => [...prev, newEvent]);
    }, [activeCompany]);

    const updateEvent = useCallback(async (event: CalendarEvent) => {
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    }, []);
    
    const updateCompany = useCallback(async (company: Company) => {
        setActiveCompany(company);
    }, []);

    const addObligation = useCallback(async (obligation: Omit<Obligation, 'id' | 'companyId' | 'status'>) => {
        if (!activeCompany) return;
        const newObligation: Obligation = {
            ...obligation,
            id: `ob-${Date.now()}`,
            companyId: activeCompany.id,
            status: 'active',
        };
        setObligations(prev => [...prev, newObligation]);
    }, [activeCompany]);

    const deleteObligation = useCallback(async (id: string) => {
        setObligations(prev => prev.filter(ob => ob.id !== id));
    }, []);
    
    const markNotificationAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAllNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);
    
    const addNewComplianceDocument = useCallback(async (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => {
        const newDoc: ComplianceDocument = {
            ...doc,
            id: `cdoc-${Date.now()}`,
            uploadDate: new Date().toISOString(),
        };
        setComplianceDocuments(prev => [newDoc, ...prev]);
    }, []);

    const deleteComplianceDocument = useCallback(async (id: string) => {
        setComplianceDocuments(prev => prev.filter(doc => doc.id !== id));
    }, []);

    const value = {
        loading,
        activeCompany,
        companyUsers,
        events,
        obligations,
        notifications,
        taskCategories,
        complianceDocuments,
        importedCompanyData,
        addEvent,
        updateEvent,
        updateCompany,
        addObligation,
        deleteObligation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNewComplianceDocument,
        deleteComplianceDocument,
        setImportedCompanyData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
