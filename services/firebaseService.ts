
import { 
    UserProfile, Company, CalendarEvent, Obligation, Notification, TaskCategory, ComplianceDocument
} from '../lib/types';

const MOCK_USERS: UserProfile[] = [
    { 
        uid: 'user-admin-01', 
        email: 'admin@compliance.pro', 
        displayName: 'Admin User', 
        role: 'admin',
        companyId: 'comp-01',
        emailPreferences: { taskAssigned: true, taskDue: true }
    },
    { 
        uid: 'user-consultor-01', 
        email: 'consultant@compliance.pro', 
        displayName: 'Consultant User', 
        role: 'consultor',
        companyId: 'comp-01',
        emailPreferences: { taskAssigned: true, taskDue: false }
    },
    { 
        uid: 'user-cliente-01', 
        email: 'client@compliance.pro', 
        displayName: 'Client User', 
        role: 'cliente',
        companyId: 'comp-01',
        emailPreferences: { taskAssigned: false, taskDue: true }
    },
];

const MOCK_COMPANY: Company = {
    id: 'comp-01',
    name: 'Innovatech Manufactura S.A. de C.V.',
    general: {
        datosFiscales: {
            razonSocial: 'Innovatech Manufactura S.A. de C.V.',
            rfc: 'IMA123456XYZ',
            domicilioFiscal: 'Parque Industrial Querétaro, Av. de la Luz #123, Querétaro, Qro. C.P. 76220',
            telefono: '442-123-4567'
        }
    },
    programas: {
        immex: { numeroRegistro: 'IM-123-2020', modalidad: 'Industrial', fechaAutorizacion: '2020-01-15' },
        prosec: { numeroRegistro: 'PS-456-2021', sector: 'Electrónico', fechaAutorizacion: '2021-03-20' },
    },
    miembros: [{id: 'mem-1', nombre: 'Juan Pérez', rfc: 'PEPJ800101ABC'}],
    domicilios: [{id: 'dom-1', tipo: 'Planta', direccionCompleta: 'Av. de la Luz #123', telefono: '442-123-4568'}],
    agentesAduanales: [{id: 'ag-1', nombre: 'Agencia Aduanal del Bajío', numeroPatente: '3001', estadoEncargo: 'Activo'}],
    documents: [],
};

const MOCK_TASK_CATEGORIES: TaskCategory[] = [
    { id: 'cat-1', name: 'Fiscal' },
    { id: 'cat-2', name: 'Aduanero' },
    { id: 'cat-3', name: 'Legal Corporativo' },
    { id: 'cat-4', name: 'Comercio Exterior' },
];

const MOCK_EVENTS: CalendarEvent[] = [
    { id: 'evt-1', companyId: 'comp-01', title: 'Presentar declaración mensual de IVA', description: 'Corresponde al mes de Mayo', dueDate: new Date(new Date().setDate(17)).toISOString().split('T')[0], status: 'pending', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-2', companyId: 'comp-01', title: 'Pago de impuestos sobre la nómina', description: '', dueDate: new Date(new Date().setDate(15)).toISOString().split('T')[0], status: 'completed', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-3', companyId: 'comp-01', title: 'Revisión de pedimentos de importación', description: 'Revisar pedimentos de la semana pasada.', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-2', reminders: []},
    { id: 'evt-4', companyId: 'comp-01', title: 'Auditoría interna de Anexo 24', description: '', dueDate: '2024-04-10', status: 'overdue', priority: 'high', category: 'cat-4', reminders: [] },
];

const MOCK_OBLIGATIONS: Obligation[] = [
    { id: 'ob-1', companyId: 'comp-01', title: 'Reporte Anual de Operaciones de Comercio Exterior', description: 'Presentar ante la SE el reporte anual.', category: 'cat-4', frequency: 'yearly', status: 'active' },
    { id: 'ob-2', companyId: 'comp-01', title: 'Declaración Mensual de Operaciones con Terceros (DIOT)', description: 'Presentar ante el SAT.', category: 'cat-1', frequency: 'monthly', status: 'active' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-cliente-01', type: 'TASK_DUE', message: 'La tarea "Presentar declaración mensual de IVA" vence pronto.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false },
    { id: 'notif-2', userId: 'user-cliente-01', type: 'TASK_OVERDUE', message: 'La tarea "Auditoría interna de Anexo 24" está vencida.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), isRead: false },
    { id: 'notif-3', userId: 'user-cliente-01', type: 'TASK_ASSIGNED', message: 'Se te asignó la tarea "Revisión de pedimentos".', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), isRead: true },
];

const MOCK_COMPLIANCE_DOCS: ComplianceDocument[] = [
    { id: 'cdoc-1', title: 'Ley Aduanera', description: 'Ley que regula la entrada y salida de mercancías del territorio nacional.', category: 'Ley', publicationDate: '2023-12-15', fileName: 'ley_aduanera.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1024 * 512, uploadDate: new Date().toISOString(), aiSummary: '• Establece las regulaciones para el despacho aduanero.\n• Define los regímenes aduaneros aplicables.\n• Fija las infracciones y sanciones en materia aduanera.'},
    { id: 'cdoc-2', title: 'Reglas Generales de Comercio Exterior 2024', description: 'Disposiciones de carácter general en materia de comercio exterior para el año 2024.', category: 'RGCE', publicationDate: '2024-01-01', fileName: 'rgce_2024.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1024 * 1024 * 2, uploadDate: new Date().toISOString(), aiSummary: '• Actualiza los procedimientos para la importación y exportación.\n• Modifica los requisitos para certificaciones como IVA/IEPS y OEA.\n• Introduce nuevos criterios para la clasificación arancelaria.'},
];


// --- EXPORTED FUNCTIONS ---

// Used for the login page simulation
export const getMockLoginUsers = (): UserProfile[] => {
    return MOCK_USERS;
};

// Used by AppContext to load all data for the logged-in user's company
export const getMockDataForUser = async (uid: string) => {
    const user = MOCK_USERS.find(u => u.uid === uid);
    if (!user) throw new Error("User not found in mock data");
    
    // Simulate API delay
    await new Promise(res => setTimeout(res, 500));

    return {
        company: MOCK_COMPANY,
        companyUsers: MOCK_USERS.filter(u => u.companyId === user.companyId),
        events: MOCK_EVENTS,
        obligations: MOCK_OBLIGATIONS,
        notifications: MOCK_NOTIFICATIONS,
        taskCategories: MOCK_TASK_CATEGORIES,
        complianceDocuments: MOCK_COMPLIANCE_DOCS,
    };
};
