import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCompanyData, addCalendarEvent, updateCalendarEvent, addObligationData, updateCompanyData } from '../services/firebaseService';
import { Company, UserProfile, CalendarEvent, Obligation, TaskCategory, Notification } from '../lib/types';

interface AppContextType {
    activeCompany: Company | null;
    companyUsers: UserProfile[];
    events: CalendarEvent[];
    obligations: Obligation[];
    taskCategories: TaskCategory[];
    notifications: Notification[];
    loading: boolean;
    addEvent: (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => Promise<void>;
    updateEvent: (event: CalendarEvent) => Promise<void>;
    addObligation: (obligationData: Omit<Obligation, 'id' | 'companyId' | 'status'>) => Promise<void>;
    updateCompany: (company: Company) => Promise<void>;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchData = useCallback(async (companyId: string) => {
        setLoading(true);
        try {
            const data = await getCompanyData(companyId);
            setActiveCompany(data.company);
            setCompanyUsers(data.users);
            setEvents(data.events);
            setObligations(data.obligations);
            setTaskCategories(data.categories);
            setNotifications(data.notifications);
        } catch (error) {
            console.error("Failed to fetch company data:", error);
            // Handle error state, e.g., show a toast
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.companyId) {
            fetchData(user.companyId);
        } else {
            // No user or company, reset state
            setLoading(false);
            setActiveCompany(null);
            setCompanyUsers([]);
            setEvents([]);
            setObligations([]);
            setTaskCategories([]);
            setNotifications([]);
        }
    }, [user, fetchData]);
    
    const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        if (!activeCompany) throw new Error("No active company");
        const newEvent = await addCalendarEvent(activeCompany.id, eventData);
        setEvents(prev => [...prev, newEvent]);
    }, [activeCompany]);

    const updateEvent = useCallback(async (event: CalendarEvent) => {
        const updatedEvent = await updateCalendarEvent(event);
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    }, []);
    
    const addObligation = useCallback(async (obligationData: Omit<Obligation, 'id' | 'companyId' | 'status'>) => {
        if (!activeCompany) throw new Error("No active company");
        const newObligation = await addObligationData(activeCompany.id, obligationData);
        setObligations(prev => [...prev, newObligation]);
    }, [activeCompany]);
    
    const updateCompany = useCallback(async (company: Company) => {
        const updatedCompany = await updateCompanyData(company);
        setActiveCompany(updatedCompany);
    }, []);

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const value = {
        activeCompany,
        companyUsers,
        events,
        obligations,
        taskCategories,
        notifications,
        loading,
        addEvent,
        updateEvent,
        addObligation,
        updateCompany,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
