import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { 
    Company, 
    CalendarEvent, 
    TaskCategory, 
    Obligation, 
    UserProfile, 
    Notification, 
    AIExtractedCompany,
    ComplianceDocument,
    ObligationFrequency
} from '../lib/types';
import {
    getMockCompany,
    getMockEvents,
    getMockTaskCategories,
    getMockObligations,
    getMockCompanyUsers,
    getMockNotifications,
    getMockComplianceDocs
} from '../services/firebaseService';

interface AppContextType {
  loading: boolean;
  activeCompany: Company | null;
  updateCompany: (companyData: Company) => Promise<void>;
  events: CalendarEvent[];
  addEvent: (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => Promise<void>;
  updateEvent: (eventData: CalendarEvent) => Promise<void>;
  taskCategories: TaskCategory[];
  obligations: Obligation[];
  addObligation: (data: { title: string; description: string; category: string; frequency: ObligationFrequency }) => Promise<void>;
  deleteObligation: (id: string) => Promise<void>;
  companyUsers: UserProfile[];
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  importedCompanyData: AIExtractedCompany | null;
  setImportedCompanyData: (data: AIExtractedCompany | null) => void;
  complianceDocuments: ComplianceDocument[];
  addNewComplianceDocument: (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => Promise<void>;
  deleteComplianceDocument: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [loading, setLoading] = useState(true);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [importedCompanyData, setImportedCompanyData] = useState<AIExtractedCompany | null>(null);
  const [complianceDocuments, setComplianceDocuments] = useState<ComplianceDocument[]>([]);

  useEffect(() => {
      if (user) {
          setLoading(true);
          const companyData = getMockCompany(user.companyId);
          setActiveCompany(companyData || null);
          setEvents(getMockEvents(user.companyId));
          setTaskCategories(getMockTaskCategories(user.companyId));
          setObligations(getMockObligations(user.companyId));
          setCompanyUsers(getMockCompanyUsers(user.companyId));
          setNotifications(getMockNotifications());
          setComplianceDocuments(getMockComplianceDocs());
          setLoading(false);
      } else {
          // Clear data on logout
          setActiveCompany(null);
          setEvents([]);
          setTaskCategories([]);
          setObligations([]);
          setCompanyUsers([]);
          setNotifications([]);
          setComplianceDocuments([]);
      }
  }, [user]);

  const updateCompany = useCallback(async (companyData: Company) => {
      await new Promise(res => setTimeout(res, 500));
      setActiveCompany(companyData);
  }, []);

  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'companyId'>) => {
      await new Promise(res => setTimeout(res, 500));
      const newEvent: CalendarEvent = {
          ...eventData,
          id: `evt-${Date.now()}`,
          companyId: activeCompany!.id,
      };
      setEvents(prev => [...prev, newEvent]);
  }, [activeCompany]);

  const updateEvent = useCallback(async (eventData: CalendarEvent) => {
      await new Promise(res => setTimeout(res, 500));
      setEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e));
  }, []);

  const addObligation = useCallback(async (data: { title: string; description: string; category: string; frequency: ObligationFrequency }) => {
      await new Promise(res => setTimeout(res, 500));
      const newOb: Obligation = { ...data, id: `ob-${Date.now()}`, companyId: activeCompany!.id, status: 'active' };
      setObligations(prev => [...prev, newOb]);
  }, [activeCompany]);

  const deleteObligation = useCallback(async (id: string) => {
      await new Promise(res => setTimeout(res, 500));
      setObligations(prev => prev.filter(ob => ob.id !== id));
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  }, []);

  const addNewComplianceDocument = useCallback(async (doc: Omit<ComplianceDocument, 'id' | 'uploadDate'>) => {
      await new Promise(res => setTimeout(res, 500));
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
      updateCompany,
      events,
      addEvent,
      updateEvent,
      taskCategories,
      obligations,
      addObligation,
      deleteObligation,
      companyUsers,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      importedCompanyData,
      setImportedCompanyData,
      complianceDocuments,
      addNewComplianceDocument,
      deleteComplianceDocument
  };

  return (
      <AppContext.Provider value={value}>
          {children}
      </AppContext.Provider>
  );
};
