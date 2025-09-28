// services/firebaseService.ts
import { Company, UserProfile, UserRole, CalendarEvent, Obligation, Notification, TaskCategory, ComplianceDocument, AggregatedCompanyData } from '../lib/types';

// --- MOCK DATABASE ---
// This acts as our in-memory "cloud" database for the simulation.
let MOCK_DB: {
    [companyId: string]: {
        company: Company;
        companyUsers: UserProfile[];
        events: CalendarEvent[];
        obligations: Obligation[];
        notifications: Notification[];
        taskCategories: TaskCategory[];
        complianceDocuments: ComplianceDocument[];
    }
} = {};

// --- Initial Mock Data (for first-time setup) ---
const MOCK_USERS_COMP1: UserProfile[] = [
    { uid: 'user-1', email: 'admin@compliance.pro', displayName: 'Admin User', role: 'admin', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: true } },
    { uid: 'user-2', email: 'consultor@compliance.pro', displayName: 'Consultor User', role: 'consultor', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: false } },
    { uid: 'user-3', email: 'cliente@compliance.pro', displayName: 'Cliente User', role: 'cliente', companyId: 'comp-1', emailPreferences: { taskAssigned: false, taskDue: true } },
];
const MOCK_USERS_COMP2: UserProfile[] = [
     { uid: 'user-4', email: 'manager@innovate.com', displayName: 'Manager Innovate', role: 'cliente', companyId: 'comp-2', emailPreferences: { taskAssigned: true, taskDue: true } },
];

const getInitialData = (companyId: string, companyName: string, users: UserProfile[]): ReturnType<typeof getInitialDataForCompany1> => {
    if (companyId === 'comp-1') {
        return getInitialDataForCompany1(companyId);
    }
    return getInitialDataForCompany2(companyId);
};

const getInitialDataForCompany1 = (companyId: string) => {
    const MOCK_COMPANY: Company = {
        id: companyId,
        name: 'TechSolutions S.A. de C.V.',
        general: {
            datosFiscales: {
                razonSocial: 'TechSolutions S.A. de C.V.',
                rfc: 'TSO123456XYZ',
                domicilioFiscal: 'Av. Innovación 123, Parque Tecnológico, Querétaro, QRO 76000',
                telefono: '442-123-4567',
            },
            actaConstitutiva: {
                numeroEscritura: '54321',
                fecha: '2010-05-20',
                notarioPublico: 'Lic. Juan Pérez',
            },
            representanteLegal: {
                nombre: 'Ana García',
                poderNotarial: '12345',
            }
        },
        programas: {
            immex: { 
                numeroRegistro: 'IM-9876-2010', 
                tipo: 'Industrial',
                fechaAutorizacion: '2010-06-15',
                fechaRenovacion: '2025-06-15',
                domiciliosAutorizados: [
                    { id: 'dimmex-1', direccion: 'Av. Innovación 123, Parque Tecnológico, Querétaro' },
                    { id: 'dimmex-2', direccion: 'Blvd. Bernardo Quintana 100, Querétaro' }
                ]
            },
            prosec: { 
                numeroRegistro: 'PS-5432-2011', 
                sector: 'Electrónico',
                fechaAutorizacion: '2011-03-22',
                 domiciliosAutorizados: [
                    { id: 'dprosec-1', direccion: 'Av. Innovación 123, Parque Tecnológico, Querétaro' }
                ]
            },
        },
        domicilios: [
            { id: 'dom-1', direccionCompleta: 'Blvd. Bernardo Quintana 100, Querétaro', telefono: '442-987-6543' }
        ],
        miembros: [
            { id: 'mem-1', nombre: 'Carlos López', rfc: 'LOLC850101ABC' }
        ],
        agentesAduanales: [
            { id: 'aa-1', nombre: 'Agencia Aduanal del Bajío', numeroPatente: '3333', estadoEncargo: 'Activo' }
        ],
        anexo24: {
            empresa: 'Software Anexo Pro',
            linkAcceso: 'https://anexo.pro/login',
            version: '3.1.5'
        },
        padrones: {
            importadores: { numero: 'PIM-123456', activo: true },
            sectoriales: [
                { id: 'sec-1', sector: 'Electrónico', fraccion: '8517.12.01' },
                { id: 'sec-2', sector: 'Siderúrgico', fraccion: '7208.10.01' }
            ]
        }
    };

    const MOCK_TASK_CATEGORIES: TaskCategory[] = [
        { id: 'cat-1', name: 'Fiscal' },
        { id: 'cat-2', name: 'Aduanero' },
        { id: 'cat-3', name: 'Legal Corporativo' },
        { id: 'cat-4', name: 'Comercio Exterior' },
    ];

    const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
        { id: 'evt-1', companyId: companyId, title: 'Declaración mensual de IVA', description: 'Preparar y presentar la declaración de IVA correspondiente al mes anterior.', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], status: 'pending', priority: 'high', category: 'cat-1', reminders: [], assignedTo: 'user-2', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'evt-2', companyId: companyId, title: 'Revisión de pedimentos de importación', description: 'Auditar una muestra de pedimentos del último mes.', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-2', reminders: [], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'evt-3', companyId: companyId, title: 'Pago de impuestos sobre la nómina', description: 'Calcular y pagar el ISN.', dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0], status: 'overdue', priority: 'high', category: 'cat-1', reminders: [], assignedTo: 'user-2', createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { id: 'evt-4', companyId: companyId, title: 'Reporte de Anexo 24', description: 'Generar reporte mensual de Anexo 24.', dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], status: 'completed', priority: 'medium', category: 'cat-4', reminders: [], assignedTo: 'user-1', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    ];

    const MOCK_OBLIGATIONS: Obligation[] = [
        { id: 'ob-1', companyId: companyId, title: 'Declaración Anual', description: 'Presentar la declaración anual de impuestos.', category: 'cat-1', frequency: 'yearly', status: 'active' },
        { id: 'ob-2', companyId: companyId, title: 'Reporte IMMEX', description: 'Presentar el reporte anual de operaciones de comercio exterior.', category: 'cat-4', frequency: 'yearly', status: 'active' },
    ];

    const MOCK_NOTIFICATIONS: Notification[] = [
        { id: 'notif-1', userId: 'user-1', type: 'TASK_OVERDUE', message: 'La tarea "Pago de impuestos sobre la nómina" está vencida.', isRead: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
    
    const MOCK_COMPLIANCE_DOCS: ComplianceDocument[] = [
         { id: 'cdoc-1', title: 'Ley Aduanera 2024', description: 'Texto vigente de la Ley Aduanera.', category: 'Ley', publicationDate: '2024-01-01', uploadDate: new Date().toISOString(), fileName: 'ley_aduanera.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1024 * 500, aiSummary: 'Este documento detalla las regulaciones para la entrada y salida de mercancías del territorio nacional, incluyendo las obligaciones de los importadores, exportadores y agentes aduanales.' },
    ];

    return {
        company: MOCK_COMPANY,
        companyUsers: MOCK_USERS_COMP1,
        events: MOCK_CALENDAR_EVENTS,
        obligations: MOCK_OBLIGATIONS,
        notifications: MOCK_NOTIFICATIONS,
        taskCategories: MOCK_TASK_CATEGORIES,
        complianceDocuments: MOCK_COMPLIANCE_DOCS
    };
}


const getInitialDataForCompany2 = (companyId: string) => {
    const MOCK_COMPANY: Company = {
        id: companyId,
        name: 'Innovate Corp S. de R.L. de C.V.',
        general: {
            datosFiscales: {
                razonSocial: 'Innovate Corp S. de R.L. de C.V.',
                rfc: 'ICO090807VMA',
                domicilioFiscal: 'Paseo de la Reforma 222, CDMX',
                telefono: '555-999-8888',
            },
            actaConstitutiva: { numeroEscritura: '99887', fecha: '2015-01-15', notarioPublico: 'Lic. Maria Elena Solis' },
            representanteLegal: { nombre: 'Roberto Morales', poderNotarial: '67890' }
        },
        programas: {
            prosec: { 
                numeroRegistro: 'PS-1122-2016', 
                sector: 'Automotriz',
                fechaAutorizacion: '2016-02-20',
                domiciliosAutorizados: []
            },
        },
        domicilios: [],
        miembros: [],
        agentesAduanales: []
    };

    const MOCK_TASK_CATEGORIES: TaskCategory[] = [
        { id: 'cat-1', name: 'Fiscal' },
        { id: 'cat-2', name: 'Aduanero' },
    ];

    const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
        { id: 'evt-c2-1', companyId: companyId, title: 'Auditoría interna de Activo Fijo', description: 'Realizar auditoría de activo fijo importado temporalmente.', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], status: 'pending', priority: 'high', category: 'cat-2', reminders: [], assignedTo: 'user-4', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    ];

    const MOCK_OBLIGATIONS: Obligation[] = [
        { id: 'ob-c2-1', companyId: companyId, title: 'Manifestación de Valor', description: 'Generar y transmitir la manifestación de valor para importaciones.', category: 'cat-2', frequency: 'yearly', status: 'active' },
    ];

    return {
        company: MOCK_COMPANY,
        companyUsers: MOCK_USERS_COMP2,
        events: MOCK_CALENDAR_EVENTS,
        obligations: MOCK_OBLIGATIONS,
        notifications: [],
        taskCategories: MOCK_TASK_CATEGORIES,
        complianceDocuments: []
    };
}

// Initialize all companies' data at startup.
const initializeAllData = () => {
    if (Object.keys(MOCK_DB).length === 0) {
        console.log("Initializing all mock company data...");
        MOCK_DB['comp-1'] = getInitialDataForCompany1('comp-1');
        MOCK_DB['comp-2'] = getInitialDataForCompany2('comp-2');
    }
}
initializeAllData();


// --- Service Functions ---

const USER_SESSION_KEY = 'complianceProUserSession';
const SIMULATED_LATENCY = 500; // 0.5 seconds

// --- User Authentication Simulation ---

export const getStoredUser = (): UserProfile | null => {
    const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
};

export const setStoredUser = (user: UserProfile) => {
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
    sessionStorage.removeItem(USER_SESSION_KEY);
};

export const getMockLoginUsers = (): UserProfile[] => {
    // Return users from the first company for login simulation
    return MOCK_USERS_COMP1;
};


// --- App Data Simulation ---

type AppData = ReturnType<typeof getInitialDataForCompany1>;

export const getAvailableCompanies = (): Promise<{id: string, name: string}[]> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const companies = Object.values(MOCK_DB).map(data => ({
                id: data.company.id,
                name: data.company.name
            }));
            resolve(companies);
        }, 200); // Shorter latency for this call
    });
}

export const getAllCompaniesData = (): Promise<AggregatedCompanyData[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const allData = Object.values(MOCK_DB).map(db => ({
                company: db.company,
                events: db.events,
                users: db.companyUsers,
            }));
            resolve(JSON.parse(JSON.stringify(allData))); // Deep copy
        }, SIMULATED_LATENCY + 200); // Slightly longer latency
    });
};

export const getData = (companyId: string): Promise<AppData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (MOCK_DB[companyId]) {
                resolve(JSON.parse(JSON.stringify(MOCK_DB[companyId]))); // Deep copy to prevent mutation
            } else {
                reject(new Error("Company data not found"));
            }
        }, SIMULATED_LATENCY);
    });
};

export const setData = (companyId: string, data: Partial<AppData>): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => {
            if (MOCK_DB[companyId]) {
                MOCK_DB[companyId] = { ...MOCK_DB[companyId], ...JSON.parse(JSON.stringify(data)) };
            }
            resolve();
        }, SIMULATED_LATENCY);
    });
};

export const createCompany = (companyDetails: { name: string; rfc: string }): Promise<Company> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newCompanyId = `comp-${Date.now()}`;
            
            const newCompany: Company = {
                id: newCompanyId,
                name: companyDetails.name,
                general: {
                    datosFiscales: {
                        razonSocial: companyDetails.name,
                        rfc: companyDetails.rfc,
                        domicilioFiscal: '',
                        telefono: '',
                    },
                    actaConstitutiva: {
                        numeroEscritura: '',
                        fecha: '',
                        notarioPublico: '',
                    },
                    representanteLegal: {
                        nombre: '',
                        poderNotarial: '',
                    }
                },
                programas: {},
                domicilios: [],
                miembros: [],
                agentesAduanales: [],
                anexo24: undefined,
                padrones: undefined
            };

            const MOCK_TASK_CATEGORIES: TaskCategory[] = [
                { id: 'cat-1', name: 'Fiscal' },
                { id: 'cat-2', name: 'Aduanero' },
                { id: 'cat-3', name: 'Legal Corporativo' },
                { id: 'cat-4', name: 'Comercio Exterior' },
            ];

            MOCK_DB[newCompanyId] = {
                company: newCompany,
                companyUsers: [], // Starts with no users
                events: [],
                obligations: [],
                notifications: [],
                taskCategories: MOCK_TASK_CATEGORIES,
                complianceDocuments: []
            };

            resolve(newCompany);
        }, SIMULATED_LATENCY);
    });
};