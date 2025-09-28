
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    Company, CalendarEvent, Obligation, UserProfile, Notification, TaskCategory, ComplianceDocument, AIExtractedCompany
} from '../lib/types';
import { useAuth } from '../hooks/useAuth';
import { getData, setData } from '../services/firebaseService';

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

type AppState = {
    activeCompany: Company | null;
    companyUsers: UserProfile[];
    events: CalendarEvent[];
    obligations: Obligation[];
    notifications: Notification[];
    taskCategories: TaskCategory[];
    complianceDocuments: ComplianceDocument[];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<AppState>({
        activeCompany: null,
        companyUsers: [],
        events: [],
        obligations: [],
        notifications: [],
        taskCategories: [],
        complianceDocuments: [],
    });
    
    const [importedCompanyData, setImportedCompanyData] = useState<AIExtractedCompany | null>(null);

    // Load data from the simulated service on user login
    useEffect(() => {
        const loadData = async () => {
            if (user?.companyId) {
                setLoading(true);
                try {
                    const data = await getData(user.companyId);
                    setState({
                        activeCompany: data.company,
                        companyUsers: data.companyUsers,
                        events: data.events,
                        obligations: data.obligations,
                        notifications: data.notifications,
                        taskCategories: data.taskCategories,
                        complianceDocuments: data.complianceDocuments,
                    });
                } catch (error) {
                    console.error("Failed to load company data:", error);
                    // Handle error state if necessary
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear data on logout
                setLoading(false);
                setState({
                    activeCompany: null, companyUsers: [], events: [], obligations: [], notifications: [], taskCategories: [], complianceDocuments: []
                });
            }
        };
        loadData();
    }, [user]);
    
    // Persist state changes to the simulated service
    const persistState = useCallback(async (newState: Partial<AppState>) => {
        if (user?.companyId) {
            const currentState = await getData(user.companyId);
            const updatedData = { ...currentState, ...newState };
            await setData(user.companyId, updatedData);
        }
    }, [user]);

    const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        if (!user?.companyId) return;
        const newEvent: CalendarEvent = {
            ...event,
            id: `evt-${Date.now()}`,
            companyId: user.companyId,
        };
        let updatedEvents: CalendarEvent[] = [];
        setState(s => {
            updatedEvents = [...s.events, newEvent];
            return { ...s, events: updatedEvents };
        });
        await persistState({ events: updatedEvents });
    }, [user, persistState]);

    const updateEvent = useCallback(async (event: CalendarEvent) => {
        let updatedEvents: CalendarEvent[] = [];
        setState(s => {
            updatedEvents = s.events.map(e => e.id === event.id ? event : e);
            return { ...s, events: updatedEvents };
        });
        await persistState({ events: updatedEvents });
    }, [persistState]);
    
    const updateCompany = useCallback(async (company: Company) => {
        setState(s => ({ ...s, activeCompany: company }));
        await persistState({ activeCompany: company });
    }, [persistState]);

    const addObligation = useCallback(async (obligation: Omit<Obligation, 'id' | 'companyId' | 'status'>) => {
        if (!user?.companyId) return;
        const newObligation: Obligation = {
            ...obligation,
            id: `ob-${Date.now()}`,
            companyId: user.companyId,
            status: 'active',
        };
        let updatedObligations: Obligation[] = [];
        setState(s => {
            updatedObligations = [...s.obligations, newObligation];
            return { ...s, obligations: updatedObligations };
        });
        await persistState({ obligations: updatedObligations });
    }, [user, persistState]);

    const deleteObligation = useCallback(async (id: string) => {
        let updatedObligations: Obligation[] = [];
        setState(s => {
            updatedObligations = s.obligations.filter(ob => ob.id !== id);
            return { ...s, obligations: updatedObligations };
        });
        await persistState({ obligations: updatedObligations });
    }, [persistState]);
    
    const markNotificationAsRead = useCallback(async (id: string) => {
        let updatedNotifications: Notification[] = [];
        setState(s => {
            updatedNotifications = s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
            return { ...s, notifications: updatedNotifications };
        });
        await persistState({ notifications: updatedNotifications });
    }, [persistState]);

    const markAllNotificationsAsRead = useCallback(async () => {
        let updatedNotifications: Notification[] = [];
        setState(s => {
            updatedNotifications = s.notifications.map(n => ({ ...n, isRead: true }));
            return { ...s, notifications: updatedNotifications };
        });
        await persistState({ notifications: updatedNotifications });
    }, [persistState]);
    
    const addNewComplianceDocument = useCallback(async (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => {
        const newDoc: ComplianceDocument = {
            ...doc,
            id: `cdoc-${Date.now()}`,
            uploadDate: new Date().toISOString(),
        };
        let updatedDocs: ComplianceDocument[] = [];
        setState(s => {
            updatedDocs = [newDoc, ...s.complianceDocuments];
            return { ...s, complianceDocuments: updatedDocs };
        });
        await persistState({ complianceDocuments: updatedDocs });
    }, [persistState]);

    const deleteComplianceDocument = useCallback(async (id: string) => {
        let updatedDocs: ComplianceDocument[] = [];
        setState(s => {
            updatedDocs = s.complianceDocuments.filter(doc => doc.id !== id);
            return { ...s, complianceDocuments: updatedDocs };
        });
        await persistState({ complianceDocuments: updatedDocs });
    }, [persistState]);

    const value = {
        loading,
        activeCompany: state.activeCompany,
        companyUsers: state.companyUsers,
        events: state.events,
        obligations: state.obligations,
        notifications: state.notifications,
        taskCategories: state.taskCategories,
        complianceDocuments: state.complianceDocuments,
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
