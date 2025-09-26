import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { 
    getMockCompany, 
    getMockEvents, 
    getMockTaskCategories, 
    getMockObligations,
    getMockCompanyUsers,
    getMockNotifications,
    getMockComplianceDocs,
} from '../services/firebaseService';
import { Company, CalendarEvent, TaskCategory, Obligation, UserProfile, Notification, ComplianceDocument, AIExtractedCompany } from '../lib/types';

interface AppContextType {
    loading: boolean;
    activeCompany: Company | null;
    companyUsers: UserProfile[];
    events: CalendarEvent[];
    taskCategories: TaskCategory[];
    obligations: Obligation[];
    notifications: Notification[];
    complianceDocuments: ComplianceDocument[];
    importedCompanyData: AIExtractedCompany | null;
    setImportedCompanyData: (data: AIExtractedCompany | null) => void;
    updateCompany: (company: Company) => Promise<void>;
    addEvent: (event: Omit<CalendarEvent, 'id' | 'companyId'>) => Promise<void>;
    updateEvent: (event: CalendarEvent) => Promise<void>;
    addObligation: (obligation: Omit<Obligation, 'id' | 'companyId' | 'status'>) => Promise<void>;
    deleteObligation: (id: string) => Promise<void>;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    addNewComplianceDocument: (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => Promise<void>;
    deleteComplianceDocument: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const [loading, setLoading] = useState(true);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [complianceDocuments, setComplianceDocuments] = useState<ComplianceDocument[]>([]);
    const [importedCompanyData, setImportedCompanyData] = useState<AIExtractedCompany | null>(null);


    useEffect(() => {
        if (user?.companyId) {
            setLoading(true);
            const companyId = user.companyId;
            // Simulate fetching all data for the company
            const companyData = getMockCompany(companyId);
            const usersData = getMockCompanyUsers(companyId);
            const eventsData = getMockEvents(companyId);
            const categoriesData = getMockTaskCategories(companyId);
            const obligationsData = getMockObligations(companyId);
            const notificationsData = getMockNotifications();
            const complianceDocsData = getMockComplianceDocs();
            
            setActiveCompany(companyData || null);
            setCompanyUsers(usersData);
            setEvents(eventsData);
            setTaskCategories(categoriesData);
            setObligations(obligationsData);
            setNotifications(notificationsData);
            setComplianceDocuments(complianceDocsData);

            setLoading(false);
        } else if (!authContext?.loading) {
            // If there's no user and auth is not loading, we are done.
            setLoading(false);
        }
    }, [user, authContext?.loading]);
    
    // MOCK DATA MODIFICATION FUNCTIONS
    const updateCompany = useCallback(async (company: Company) => {
        await new Promise(res => setTimeout(res, 500));
        setActiveCompany(company);
    }, []);

    const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        await new Promise(res => setTimeout(res, 500));
        if (user) {
            setEvents(prev => [...prev, { ...event, id: `evt-${Date.now()}`, companyId: user.companyId }]);
        }
    }, [user]);

    const updateEvent = useCallback(async (event: CalendarEvent) => {
        await new Promise(res => setTimeout(res, 500));
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    }, []);
    
    const addObligation = useCallback(async (obligation: Omit<Obligation, 'id' | 'companyId' | 'status'>) => {
        await new Promise(res => setTimeout(res, 500));
        if (user) {
            const newObligation: Obligation = {
                ...obligation,
                id: `ob-${Date.now()}`,
                companyId: user.companyId,
                status: 'active'
            };
            setObligations(prev => [...prev, newObligation]);
        }
    }, [user]);

    const deleteObligation = useCallback(async (id: string) => {
        await new Promise(res => setTimeout(res, 500));
        setObligations(prev => prev.filter(ob => ob.id !== id));
    }, []);

    const markNotificationAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);
    
    const markAllNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const addNewComplianceDocument = useCallback(async (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newDoc: ComplianceDocument = {
            ...doc,
            id: `cdoc-${Date.now()}`,
            uploadDate: new Date().toISOString()
        };
        setComplianceDocuments(prev => [newDoc, ...prev]);
    }, []);

    const deleteComplianceDocument = useCallback(async (id: string) => {
        await new Promise(res => setTimeout(res, 500));
        setComplianceDocuments(prev => prev.filter(doc => doc.id !== id));
    }, []);

    const value = { 
        loading, 
        activeCompany,
        companyUsers,
        events, 
        taskCategories,
        obligations,
        notifications,
        complianceDocuments,
        importedCompanyData,
        setImportedCompanyData,
        updateCompany,
        addEvent,
        updateEvent,
        addObligation,
        deleteObligation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNewComplianceDocument,
        deleteComplianceDocument,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
