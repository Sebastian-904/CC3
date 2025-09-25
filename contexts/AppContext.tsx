import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Company, CalendarEvent, Obligation, TaskCategory, UserProfile, Notification } from '../lib/types';
import { useAuth } from '../hooks/useAuth';
import { 
    getCompanies, 
    getEventsForCompany, 
    getObligationsForCompany, 
    updateCompanyData, 
    getTaskCategories, 
    addEventToCompany,
    getUsersForCompany,
    updateEvent as updateEventInDb,
    getNotificationsForUser,
    markNotificationAsRead as markAsReadInDb,
    markAllNotificationsAsRead as markAllAsReadInDb
} from '../services/firebaseService';

interface AppContextType {
    companies: Company[];
    activeCompany: Company | null;
    setActiveCompanyId: (id: string) => void;
    events: CalendarEvent[];
    obligations: Obligation[];
    taskCategories: TaskCategory[];
    companyUsers: UserProfile[];
    notifications: Notification[];
    loading: boolean;
    updateCompany: (companyData: Company) => Promise<void>;
    addEvent: (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => Promise<void>;
    updateEvent: (eventData: CalendarEvent) => Promise<void>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(() => localStorage.getItem('activeCompanyId'));
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const setActiveCompanyId = useCallback((id: string) => {
        localStorage.setItem('activeCompanyId', id);
        setActiveCompanyIdState(id);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [fetchedCompanies, fetchedCategories] = await Promise.all([
                    getCompanies(),
                    getTaskCategories()
                ]);

                setCompanies(fetchedCompanies);
                setTaskCategories(fetchedCategories);

                if (fetchedCompanies.length > 0) {
                    const savedId = localStorage.getItem('activeCompanyId');
                    const idToSet = savedId && fetchedCompanies.some(c => c.id === savedId)
                        ? savedId
                        : fetchedCompanies[0].id;
                    if (idToSet) {
                       setActiveCompanyId(idToSet);
                    }
                }
            } catch (error) {
                console.error("Failed to load initial app data:", error);
            }
        };
        loadInitialData();
    }, [setActiveCompanyId]);

    useEffect(() => {
        if (activeCompanyId) {
            const loadCompanySpecificData = async () => {
                setLoading(true);
                 try {
                    const [companyEvents, companyObligations, users] = await Promise.all([
                        getEventsForCompany(activeCompanyId),
                        getObligationsForCompany(activeCompanyId),
                        getUsersForCompany(activeCompanyId)
                    ]);
                    setEvents(companyEvents);
                    setObligations(companyObligations);
                    setCompanyUsers(users);
                } catch (error) {
                    console.error(`Failed to load data for company ${activeCompanyId}:`, error);
                    setEvents([]);
                    setObligations([]);
                    setCompanyUsers([]);
                } finally {
                    setLoading(false);
                }
            };
            loadCompanySpecificData();
        } else if (companies.length > 0) {
            setLoading(false);
        }
    }, [activeCompanyId, companies]);

    useEffect(() => {
        if (user?.uid) {
            getNotificationsForUser(user.uid).then(setNotifications);
        }
    }, [user]);

    const activeCompany = useMemo(() => {
        return companies.find(c => c.id === activeCompanyId) || null;
    }, [companies, activeCompanyId]);

    const updateCompany = useCallback(async (companyData: Company) => {
        const updatedCompany = await updateCompanyData(companyData);
        setCompanies(prevCompanies => prevCompanies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    }, []);

    const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => {
        if (!activeCompanyId) {
            console.error("No active company to add event to.");
            return;
        }
        const newEvent = await addEventToCompany(activeCompanyId, eventData);
        setEvents(prevEvents => [...prevEvents, newEvent].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    }, [activeCompanyId]);

    const updateEvent = useCallback(async (eventData: CalendarEvent) => {
        const updatedEvent = await updateEventInDb(eventData);
        setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    }, []);
    
    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        await markAsReadInDb(notificationId);
    }, []);
    
    const markAllNotificationsAsRead = useCallback(async () => {
        if (!user?.uid) return;
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        await markAllAsReadInDb(user.uid);
    }, [user]);


    const value = {
        companies,
        activeCompany,
        setActiveCompanyId,
        events,
        obligations,
        taskCategories,
        companyUsers,
        notifications,
        loading,
        updateCompany,
        addEvent,
        updateEvent,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};