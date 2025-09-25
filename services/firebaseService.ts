import { UserProfile, Company, CalendarEvent, Obligation, TaskCategory, Notification } from '../lib/types';

// --- MOCK DATA ---

const MOCK_COMPANIES: Company[] = [
    {
        id: 'comp-1',
        name: 'Innovatech Solutions S.A. de C.V.',
        general: {
            datosFiscales: { razonSocial: 'Innovatech Solutions S.A. de C.V.', rfc: 'ISO123456XYZ', actividadEconomica: 'Desarrollo de Software', telefono: '55-1234-5678', domicilioFiscal: 'Av. Insurgentes Sur 123, Piso 10, CDMX' },
            actaConstitutiva: { numeroEscritura: '98765', fecha: '2018-05-15', nombreFedatario: 'Lic. Juan Pérez' },
            representanteLegal: { numeroEscrituraPoder: '54321', fechaPoder: '2019-01-20', nombreFedatario: 'Lic. Ana García' }
        },
        programas: {
            immex: { numeroRegistro: 'IMX-001', modalidad: 'Industrial', fechaAutorizacion: '2019-03-10' },
            certificacionIVAYIEPS: { folio: 'IVA-A-001', rubro: 'A', resolucion: 'Resolución de Certificación', proximaRenovacion: '2025-06-30' }
        },
        miembros: [{ id: 'm-1', nombre: 'Tech Holding Inc.', rfc: 'THI987654ABC', tipoPersona: 'Moral', caracter: 'Accionista', nacionalidad: 'Estadounidense', tributaEnMexico: true }],
        domicilios: [{ id: 'd-1', direccionCompleta: 'Parque Industrial Queretaro, Bodega 5, Queretaro, Qro.', telefono: '442-987-6543', programaVinculado: 'IMMEX' }],
        agentesAduanales: [{ id: 'a-1', nombre: 'Logística Global Aduanal', numeroPatente: '3456', estadoEncargo: 'Activo' }]
    },
    {
        id: 'comp-2',
        name: 'Global Exports Logistics',
        general: {
            datosFiscales: { razonSocial: 'Global Exports Logistics S. de R.L.', rfc: 'GEL098765QWE', actividadEconomica: 'Logística y Transporte', telefono: '81-8765-4321', domicilioFiscal: 'Carretera Miguel Alemán Km 25, Apodaca, NL' },
            actaConstitutiva: { numeroEscritura: '11223', fecha: '2020-02-20', nombreFedatario: 'Lic. Carlos Rodríguez' },
            representanteLegal: { numeroEscrituraPoder: '33445', fechaPoder: '2020-03-01', nombreFedatario: 'Lic. Sofia Martinez' }
        },
        programas: {},
        miembros: [],
        domicilios: [],
        agentesAduanales: []
    }
];

const MOCK_EVENTS: CalendarEvent[] = [
    { id: 'evt-1', title: 'Declaración Anual', dueDate: '2024-03-31', status: 'overdue', priority: 'high', category: 'cat-1', description: 'Presentar la declaración anual de impuestos.', companyId: 'comp-1', assigneeId: 'user-2'},
    { id: 'evt-2', title: 'Pago Provisional ISR', dueDate: new Date().toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-1', description: 'Realizar el pago provisional de ISR del mes.', companyId: 'comp-1', assigneeId: 'user-3'},
    { id: 'evt-3', title: 'Reporte de Inventarios IMMEX', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-2', description: 'Generar y enviar reporte de inventarios.', companyId: 'comp-1', assigneeId: 'user-3'},
    { id: 'evt-4', title: 'Auditoría Interna', dueDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString().split('T')[0], status: 'completed', priority: 'low', category: 'cat-3', description: 'Revisión trimestral interna completada.', companyId: 'comp-1', assigneeId: 'user-2'},
];

// FIX: Updated MOCK_OBLIGATIONS to use `dueDate` instead of `dayOfMonth` to match the updated Obligation type.
const MOCK_OBLIGATIONS: Obligation[] = [
    { id: 'ob-1', title: 'Declaración Mensual de IVA', category: 'cat-1', frequency: 'monthly', dueDate: '17th of each month', status: 'active', companyId: 'comp-1', assigneeId: 'user-3' },
    { id: 'ob-2', title: 'Reporte Anual de Operaciones', category: 'cat-2', frequency: 'yearly', dueDate: 'May 30th of each year', status: 'active', companyId: 'comp-1', assigneeId: 'user-2' },
];

const MOCK_TASK_CATEGORIES: TaskCategory[] = [
    { id: 'cat-1', name: 'Fiscal', color: 'bg-blue-500' },
    { id: 'cat-2', name: 'Comercio Exterior', color: 'bg-green-500' },
    { id: 'cat-3', name: 'Corporativo', color: 'bg-yellow-500' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-3', type: 'TASK_ASSIGNED', message: "Bob Consultant assigned 'Pago Provisional ISR' to you.", isRead: false, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), linkTo: 'evt-2' },
    { id: 'notif-2', userId: 'user-2', type: 'TASK_OVERDUE', message: "The task 'Declaración Anual' is 3 days overdue.", isRead: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), linkTo: 'evt-1' },
    { id: 'notif-3', userId: 'user-3', type: 'TASK_DUE', message: "Your task 'Pago Provisional ISR' is due today.", isRead: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), linkTo: 'evt-2' },
    { id: 'notif-4', userId: 'user-2', type: 'COMMENT_MENTION', message: "Alice Admin mentioned you in a comment on 'Auditoría Interna'.", isRead: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), linkTo: 'evt-4' },
];


export const MOCK_USERS: UserProfile[] = [
    { uid: 'user-1', email: 'alice.admin@example.com', displayName: 'Alice Admin', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', role: 'admin' },
    { uid: 'user-2', email: 'bob.consultant@example.com', displayName: 'Bob Consultant', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: 'consultor' },
    { uid: 'user-3', email: 'charlie.employee@example.com', displayName: 'Charlie Employee', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: 'employee', companyId: 'comp-1' },
    { uid: 'user-4', email: 'diana.employee@example.com', displayName: 'Diana Employee', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: 'employee', companyId: 'comp-1' },
     { uid: 'user-5', email: 'edward.export@example.com', displayName: 'Edward Export', avatarUrl: 'https://i.pravatar.cc/150?u=user-5', role: 'employee', companyId: 'comp-2' },
];

let currentUser: UserProfile | null = null;
let authStateListener: ((user: { uid: string } | null) => void) | null = null;

// Mock Auth
export const mockSignIn = (email: string, pass: string): Promise<{ uid: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email);
            if (user) {
                currentUser = user;
                if (authStateListener) authStateListener({ uid: user.uid });
                resolve({ uid: user.uid });
            } else {
                reject(new Error("User not found"));
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
    setTimeout(() => callback(currentUser ? { uid: currentUser.uid } : null), 0);
    return () => { authStateListener = null; };
};

export const mockGetUserProfile = (uid: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.uid === uid);
            if (user) { resolve(user); } else { reject(new Error("User profile not found")); }
        }, 300);
    });
};

// Mock Firestore
const db = {
    companies: MOCK_COMPANIES,
    events: MOCK_EVENTS,
    obligations: MOCK_OBLIGATIONS,
    taskCategories: MOCK_TASK_CATEGORIES,
    users: MOCK_USERS,
    notifications: MOCK_NOTIFICATIONS,
};

export const getCompanies = async (): Promise<Company[]> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(db.companies))), 500));
};

export const updateCompanyData = async (companyData: Company): Promise<Company> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = db.companies.findIndex(c => c.id === companyData.id);
            if (index !== -1) {
                db.companies[index] = JSON.parse(JSON.stringify(companyData));
                resolve(companyData);
            } else {
                reject(new Error("Company not found"));
            }
        }, 500);
    });
};

export const getEventsForCompany = async (companyId: string): Promise<CalendarEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve(db.events.filter(e => e.companyId === companyId)), 500));
};

export const addEventToCompany = async (companyId: string, eventData: Omit<CalendarEvent, 'id' | 'companyId'>): Promise<CalendarEvent> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newEvent: CalendarEvent = {
                ...eventData,
                id: `event-${Date.now()}`,
                companyId,
            };
            db.events.push(newEvent);
            resolve(newEvent);
        }, 300);
    });
};

export const updateEvent = async (eventData: CalendarEvent): Promise<CalendarEvent> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = db.events.findIndex(e => e.id === eventData.id);
            if (index !== -1) {
                db.events[index] = eventData;
                resolve(eventData);
            } else {
                reject(new Error("Event not found"));
            }
        }, 300);
    });
};

export const getUsersForCompany = async (companyId: string): Promise<UserProfile[]> => {
    return new Promise(resolve => setTimeout(() => {
        const companyUsers = db.users.filter(u => u.companyId === companyId);
        const consultants = db.users.filter(u => u.role === 'consultor' || u.role === 'admin');
        resolve([...companyUsers, ...consultants]);
    }, 400));
};

export const getAllUsers = async (): Promise<(UserProfile & { companyName?: string })[]> => {
    return new Promise(resolve => setTimeout(() => {
        const allUsersWithCompany = db.users.map(u => {
            const company = db.companies.find(c => c.id === u.companyId);
            return { ...u, companyName: company?.name || 'N/A' };
        });
        resolve(allUsersWithCompany);
    }, 600));
};


export const getObligationsForCompany = async (companyId: string): Promise<Obligation[]> => {
    return new Promise(resolve => setTimeout(() => resolve(db.obligations.filter(o => o.companyId === companyId)), 500));
};

export const getTaskCategories = async (): Promise<TaskCategory[]> => {
    return new Promise(resolve => setTimeout(() => resolve(db.taskCategories), 200));
};

export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    return new Promise(resolve => setTimeout(() => {
        const userNotifications = db.notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(JSON.parse(JSON.stringify(userNotifications)));
    }, 400));
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const notification = db.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = true;
                resolve(JSON.parse(JSON.stringify(notification)));
            } else {
                reject(new Error("Notification not found"));
            }
        }, 100);
    });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<Notification[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const userNotifications = db.notifications.filter(n => n.userId === userId);
            userNotifications.forEach(n => n.isRead = true);
            resolve(JSON.parse(JSON.stringify(userNotifications)));
        }, 200);
    });
};