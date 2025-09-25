// MOCK Firebase Service
// This file simulates a Firebase backend for demonstration purposes.

import { UserProfile, Company, CalendarEvent, Obligation, Notification, TaskCategory } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

// --- MOCK DATABASE ---

export const MOCK_USERS: UserProfile[] = [
    { uid: 'user-1', email: 'admin@compliance.pro', displayName: 'Admin User', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', role: 'admin', companyId: 'comp-1', companyName: 'Global Exports Inc.', emailPreferences: { taskAssigned: true, taskDue: true, commentMention: true, dailySummary: false } },
    { uid: 'user-2', email: 'consultant@compliance.pro', displayName: 'Consultant Pro', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: 'consultor', companyId: 'comp-1', companyName: 'Global Exports Inc.', emailPreferences: { taskAssigned: true, taskDue: false, commentMention: true, dailySummary: true } },
    { uid: 'user-3', email: 'client.one@gei.com', displayName: 'Client One', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: 'cliente', companyId: 'comp-1', companyName: 'Global Exports Inc.', emailPreferences: { taskAssigned: true, taskDue: true, commentMention: false, dailySummary: false } },
    { uid: 'user-4', email: 'client.two@acme.com', displayName: 'Client Two', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: 'cliente', companyId: 'comp-2', companyName: 'Acme Imports LLC', emailPreferences: { taskAssigned: true, taskDue: true, commentMention: true, dailySummary: false } },
];

const MOCK_COMPANIES: Company[] = [
    { 
        id: 'comp-1', 
        name: 'Global Exports Inc.',
        general: {
            datosFiscales: { razonSocial: 'Global Exports Inc. S.A. de C.V.', rfc: 'GEI980321XYZ', telefono: '55-1234-5678', domicilioFiscal: 'Av. Insurgentes Sur 123, Piso 10, CDMX' },
            actaConstitutiva: { numeroEscritura: '54321', fecha: '1998-03-21', nombreFedatario: 'Lic. Juan Pérez' },
            representanteLegal: { numeroEscrituraPoder: '98765', fechaPoder: '2015-01-10', nombreFedatario: 'Lic. Ana Rodriguez' }
        },
        programas: {
            immex: { numeroRegistro: 'IMX-001', modalidad: 'Industrial', fechaAutorizacion: '2010-05-20' },
            prosec: { numeroRegistro: 'PRO-001', sector: 'Automotriz', fechaAutorizacion: '2011-06-15' }
        },
        miembros: [{ id: 'm-1', nombre: 'John Doe', rfc: 'DOEJ800101ABC', tipoPersona: 'Física', caracter: 'Socio', nacionalidad: 'Estadounidense', tributaEnMexico: true }],
        domicilios: [{ id: 'd-1', direccionCompleta: 'Parque Industrial Toluca 2000, Toluca, Edo. Méx.', telefono: '722-987-6543', programaVinculado: 'IMMEX' }],
        agentesAduanales: [{ id: 'a-1', nombre: 'Agencia Aduanal A', numeroPatente: '3001', estadoEncargo: 'Activo' }],
    },
    { 
        id: 'comp-2', 
        name: 'Acme Imports LLC',
        general: {
            datosFiscales: { razonSocial: 'Acme Imports LLC', rfc: 'AIL121212ABC', telefono: '81-8765-4321', domicilioFiscal: 'Av. Lázaro Cárdenas 456, Monterrey, N.L.' },
            actaConstitutiva: { numeroEscritura: '11223', fecha: '2012-12-12', nombreFedatario: 'Lic. Carlos Sanchez' },
            representanteLegal: { numeroEscrituraPoder: '33445', fechaPoder: '2018-02-20', nombreFedatario: 'Lic. Sofia Garza' }
        },
        programas: {
            immex: { numeroRegistro: 'IMX-002', modalidad: 'Servicios', fechaAutorizacion: '2013-01-15' }
        },
        miembros: [],
        domicilios: [],
        agentesAduanales: [],
    }
];

const MOCK_TASK_CATEGORIES: TaskCategory[] = [
    { id: 'cat-1', name: 'Fiscal', color: 'bg-blue-500' },
    { id: 'cat-2', name: 'Aduanero', color: 'bg-green-500' },
    { id: 'cat-3', name: 'Legal Corporativo', color: 'bg-purple-500' },
    { id: 'cat-4', name: 'Certificaciones', color: 'bg-yellow-500' },
];

const getInitialDate = (offsetDays: number) => new Date(new Date().setDate(new Date().getDate() + offsetDays)).toISOString().split('T')[0];

let MOCK_EVENTS: CalendarEvent[] = [
    { id: uuidv4(), companyId: 'comp-1', title: 'Declaración mensual de IVA', dueDate: getInitialDate(2), description: 'Presentar la declaración de IVA correspondiente al mes anterior.', category: 'cat-1', priority: 'high', status: 'pending', assigneeId: 'user-3' },
    { id: uuidv4(), companyId: 'comp-1', title: 'Renovación de Certificación OEA', dueDate: getInitialDate(15), description: 'Iniciar el proceso de renovación de la certificación de Operador Económico Autorizado.', category: 'cat-4', priority: 'medium', status: 'pending', assigneeId: 'user-1' },
    { id: uuidv4(), companyId: 'comp-1', title: 'Auditoría interna de Anexo 24', dueDate: getInitialDate(-5), description: 'Revisar registros y saldos del sistema de control de inventarios.', category: 'cat-2', priority: 'high', status: 'overdue', assigneeId: 'user-2' },
    { id: uuidv4(), companyId: 'comp-1', title: 'Pago de impuestos de importación', dueDate: getInitialDate(-1), description: 'Realizar el pago correspondiente a la última importación.', category: 'cat-1', priority: 'medium', status: 'completed', assigneeId: 'user-3' },
    { id: uuidv4(), companyId: 'comp-2', title: 'Presentar DIOT', dueDate: getInitialDate(5), description: 'Declaración Informativa de Operaciones con Terceros.', category: 'cat-1', priority: 'medium', status: 'pending', assigneeId: 'user-4' },
];

let MOCK_OBLIGATIONS: Obligation[] = [
    { id: uuidv4(), companyId: 'comp-1', title: 'Declaración Mensual IVA', description: 'Presentar la declaración mensual de IVA.', category: 'cat-1', frequency: 'monthly', dayOfMonth: '17', status: 'active', assigneeId: 'user-3' },
    { id: uuidv4(), companyId: 'comp-1', title: 'Reporte Anual IMMEX', description: 'Presentar el reporte anual de operaciones de comercio exterior.', category: 'cat-2', frequency: 'yearly', month: '5', dayOfMonth: 'last', status: 'active', assigneeId: 'user-2' },
];

let MOCK_NOTIFICATIONS: Notification[] = [
    { id: uuidv4(), type: 'TASK_OVERDUE', message: 'Task "Auditoría interna de Anexo 24" is overdue.', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), isRead: false },
    { id: uuidv4(), type: 'TASK_ASSIGNED', message: 'You have been assigned a new task: "Declaración mensual de IVA"', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), isRead: false },
    { id: uuidv4(), type: 'TASK_DUE', message: 'Task "Pago de impuestos de importación" is due today.', timestamp: new Date().toISOString(), isRead: true },
];

// --- MOCK AUTH ---

let currentUser: UserProfile | null = null;
let authStateListener: ((user: { uid: string } | null) => void) | null = null;

export const mockSignIn = (email: string, pass: string): Promise<{ uid: string }> => {
    console.log(`Attempting to sign in with ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email);
            if (user) {
                currentUser = user;
                if (authStateListener) authStateListener({ uid: user.uid });
                resolve({ uid: user.uid });
            } else {
                reject(new Error('User not found'));
            }
        }, 500);
    });
};

export const mockSignOut = (): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            currentUser = null;
            if (authStateListener) authStateListener(null);
            resolve();
        }, 200);
    });
};

export const onAuthStateChanged = (callback: (user: { uid: string } | null) => void): (() => void) => {
    authStateListener = callback;
    // Simulate initial state check
    setTimeout(() => {
        if (currentUser) {
            callback({ uid: currentUser.uid });
        } else {
            callback(null);
        }
    }, 100);
    return () => { authStateListener = null; };
};


// --- MOCK API ---

const apiLatency = () => Math.random() * 400 + 100; // 100-500ms delay

export const mockGetUserProfile = (uid: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.uid === uid);
            if (user) resolve(JSON.parse(JSON.stringify(user)));
            else reject(new Error('User profile not found'));
        }, apiLatency());
    });
};

export const mockUpdateUserProfile = (uid: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = MOCK_USERS.findIndex(u => u.uid === uid);
            if (userIndex > -1) {
                MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
                if (currentUser?.uid === uid) {
                    currentUser = MOCK_USERS[userIndex];
                }
                resolve(JSON.parse(JSON.stringify(MOCK_USERS[userIndex])));
            } else {
                reject(new Error('User not found'));
            }
        }, apiLatency());
    });
};

export const getAllUsers = (): Promise<UserProfile[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(MOCK_USERS)));
        }, apiLatency());
    });
};

export const getCompanyData = (companyId: string): Promise<{ company: Company; users: UserProfile[]; events: CalendarEvent[]; obligations: Obligation[]; categories: TaskCategory[]; notifications: Notification[] }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const company = MOCK_COMPANIES.find(c => c.id === companyId);
            if (!company) return reject(new Error('Company not found'));

            const users = MOCK_USERS.filter(u => u.companyId === companyId);
            const events = MOCK_EVENTS.filter(e => e.companyId === companyId);
            const obligations = MOCK_OBLIGATIONS.filter(o => o.companyId === companyId);

            resolve({
                company: JSON.parse(JSON.stringify(company)),
                users: JSON.parse(JSON.stringify(users)),
                events: JSON.parse(JSON.stringify(events)),
                obligations: JSON.parse(JSON.stringify(obligations)),
                categories: JSON.parse(JSON.stringify(MOCK_TASK_CATEGORIES)),
                notifications: JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS)),
            });
        }, apiLatency());
    });
};

export const updateCompanyData = (company: Company): Promise<Company> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_COMPANIES.findIndex(c => c.id === company.id);
            if (index > -1) {
                MOCK_COMPANIES[index] = company;
                resolve(JSON.parse(JSON.stringify(company)));
            } else {
                reject(new Error("Company not found for update"));
            }
        }, apiLatency());
    });
};

export const addCalendarEvent = (companyId: string, eventData: Omit<CalendarEvent, 'id' | 'companyId'>): Promise<CalendarEvent> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newEvent: CalendarEvent = { ...eventData, id: uuidv4(), companyId };
            MOCK_EVENTS.push(newEvent);
            resolve(JSON.parse(JSON.stringify(newEvent)));
        }, apiLatency());
    });
};

export const updateCalendarEvent = (updatedEvent: CalendarEvent): Promise<CalendarEvent> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_EVENTS.findIndex(e => e.id === updatedEvent.id);
            if (index > -1) {
                MOCK_EVENTS[index] = updatedEvent;
                resolve(JSON.parse(JSON.stringify(updatedEvent)));
            } else {
                reject(new Error("Event not found for update"));
            }
        }, apiLatency());
    });
};

export const addObligationData = (companyId: string, obligationData: Omit<Obligation, 'id' | 'companyId' | 'status'>): Promise<Obligation> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const newObligation: Obligation = { ...obligationData, id: uuidv4(), companyId, status: 'active' };
            MOCK_OBLIGATIONS.push(newObligation);
            resolve(JSON.parse(JSON.stringify(newObligation)));
        }, apiLatency());
    });
};
