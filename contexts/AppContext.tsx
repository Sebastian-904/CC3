import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCompanyData, addCalendarEvent, updateCalendarEvent, addObligationData, updateCompanyData, mockDeleteCalendarEvent, mockDeleteObligation } from '../services/firebaseService';
import { Company, UserProfile, CalendarEvent, Obligation, TaskCategory, Notification, Reminder, ReminderTime, AIExtractedCompany } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

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
    deleteEvent: (eventId: string) => Promise<void>;
    addObligation: (obligationData: Omit<Obligation, 'id' | 'companyId' | 'status'>) => Promise<void>;
    deleteObligation: (obligationId: string) => Promise<void>;
    updateCompany: (company: Company) => Promise<void>;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    importedCompanyData: AIExtractedCompany | null;
    setImportedCompanyData: React.Dispatch<React.SetStateAction<AIExtractedCompany | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const getReminderTimeInMs = (time: ReminderTime): number => {
    switch (time) {
        case '30m': return 30 * 60 * 1000;
        case '1h': return 60 * 60 * 1000;
        case '1d': return 24 * 60 * 60 * 1000;
        default: return 0;
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [importedCompanyData, setImportedCompanyData] = useState<AIExtractedCompany | null>(null);

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
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.companyId) {
            fetchData(user.companyId);
        } else if (!user) {
            // Clear data on logout
            setActiveCompany(null);
            setCompanyUsers([]);
            setEvents([]);
            setObligations([]);
            setTaskCategories([]);
            setNotifications([]);
        }
    }, [user, fetchData]);
    
    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = { ...notification, id: uuidv4() };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date().getTime();
            events.forEach(event => {
                if (event.status === 'completed') return;

                const dueDate = new Date(event.dueDate).getTime();
                if (now > dueDate) return; // Don't send reminders for past due events here

                event.reminders.forEach(reminder => {
                    const reminderTimeMs = getReminderTimeInMs(reminder.time);
                    const triggerTime = dueDate - reminderTimeMs;
                    
                    // Check if the reminder should be triggered now (within the last minute)
                    if (now >= triggerTime && now - triggerTime < 60000) {
                        const hasBeenSent = notifications.some(
                            n => n.type === 'TASK_REMINDER' && n.relatedId === event.id
                        );

                        if (!hasBeenSent) {
                             addNotification({
                                type: 'TASK_REMINDER',
                                message: `Reminder: Task "${event.title}" is due soon.`,
                                timestamp: new Date().toISOString(),
                                isRead: false,
                                relatedId: event.id
                            });
                        }
                    }
                });
            });
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);

    }, [events, notifications, addNotification]);

    const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        if (!user?.companyId) throw new Error("User has no companyId");
        const newEvent = await addCalendarEvent(user.companyId, eventData);
        setEvents(prev => [...prev, newEvent]);
    }, [user]);

    const updateEvent = useCallback(async (event: CalendarEvent) => {
        const updatedEvent = await updateCalendarEvent(event);
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    }, []);

    const deleteEvent = useCallback(async (eventId: string) => {
        await mockDeleteCalendarEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
    }, []);

    const addObligation = useCallback(async (obligationData: Omit<Obligation, 'id' | 'companyId' | 'status'>) => {
        if (!user?.companyId) throw new Error("User has no companyId");
        const newObligation = await addObligationData(user.companyId, obligationData);
        setObligations(prev => [...prev, newObligation]);
    }, [user]);
    
    const deleteObligation = useCallback(async (obligationId: string) => {
        await mockDeleteObligation(obligationId);
        setObligations(prev => prev.filter(o => o.id !== obligationId));
    }, []);

    const updateCompany = useCallback(async (company: Company) => {
        const updatedCompany = await updateCompanyData(company);
        setActiveCompany(updatedCompany);
    }, []);

    const markNotificationAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAllNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);
    

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
        deleteEvent,
        addObligation,
        deleteObligation,
        updateCompany,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        importedCompanyData,
        setImportedCompanyData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};