// services/firebaseService.ts
import { Company, UserProfile, UserRole, CalendarEvent, Obligation, Notification, TaskCategory, ComplianceDocument } from '../lib/types';

const MOCK_USERS: UserProfile[] = [
    { uid: 'user-1', email: 'admin@compliance.pro', displayName: 'Admin User', role: 'admin', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: true } },
    { uid: 'user-2', email: 'consultor@compliance.pro', displayName: 'Consultor User', role: 'consultor', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: false } },
    { uid: 'user-3', email: 'cliente@compliance.pro', displayName: 'Cliente User', role: 'cliente', companyId: 'comp-1', emailPreferences: { taskAssigned: false, taskDue: true } },
];

const MOCK_COMPANY: Company = {
    id: 'comp-1',
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
        immex: { numeroRegistro: 'IM-9876-2010', tipo: 'Industrial' },
        prosec: { numeroRegistro: 'PS-5432-2011', sector: 'Electrónico' },
    },
    domicilios: [
        { id: 'dom-1', direccionCompleta: 'Blvd. Bernardo Quintana 100, Querétaro', telefono: '442-987-6543' }
    ],
    miembros: [
        { id: 'mem-1', nombre: 'Carlos López', rfc: 'LOLC850101ABC' }
    ],
    agentesAduanales: [
        { id: 'aa-1', nombre: 'Agencia Aduanal del Bajío', numeroPatente: '3333', estadoEncargo: 'Activo' }
    ]
};

const MOCK_TASK_CATEGORIES: TaskCategory[] = [
    { id: 'cat-1', name: 'Fiscal' },
    { id: 'cat-2', name: 'Aduanero' },
    { id: 'cat-3', name: 'Legal Corporativo' },
    { id: 'cat-4', name: 'Comercio Exterior' },
];

const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 'evt-1', companyId: 'comp-1', title: 'Declaración mensual de IVA', description: 'Preparar y presentar la declaración de IVA correspondiente al mes anterior.', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], status: 'pending', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-2', companyId: 'comp-1', title: 'Revisión de pedimentos de importación', description: 'Auditar una muestra de pedimentos del último mes.', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-2', reminders: [] },
    { id: 'evt-3', companyId: 'comp-1', title: 'Pago de impuestos sobre la nómina', description: 'Calcular y pagar el ISN.', dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0], status: 'overdue', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-4', companyId: 'comp-1', title: 'Reporte de Anexo 24', description: 'Generar reporte mensual de Anexo 24.', dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], status: 'completed', priority: 'medium', category: 'cat-4', reminders: [] },
];

const MOCK_OBLIGATIONS: Obligation[] = [
    { id: 'ob-1', companyId: 'comp-1', title: 'Declaración Anual', description: 'Presentar la declaración anual de impuestos.', category: 'cat-1', frequency: 'yearly', status: 'active' },
    { id: 'ob-2', companyId: 'comp-1', title: 'Reporte IMMEX', description: 'Presentar el reporte anual de operaciones de comercio exterior.', category: 'cat-4', frequency: 'yearly', status: 'active' },
    { id: 'ob-3', companyId: 'comp-1', title: 'DIOT', description: 'Declaración Informativa de Operaciones con Terceros.', category: 'cat-1', frequency: 'monthly', status: 'active' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', userId: 'user-1', type: 'TASK_OVERDUE', message: 'La tarea "Pago de impuestos sobre la nómina" está vencida.', isRead: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'notif-2', userId: 'user-1', type: 'TASK_DUE', message: 'La tarea "Declaración mensual de IVA" vence en 5 días.', isRead: false, timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'notif-3', userId: 'user-1', type: 'TASK_ASSIGNED', message: 'Se te ha asignado la tarea "Revisión de NOM-051".', isRead: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_COMPLIANCE_DOCS: ComplianceDocument[] = [
    { id: 'cdoc-1', title: 'Ley Aduanera 2024', description: 'Texto vigente de la Ley Aduanera.', category: 'Ley', publicationDate: '2024-01-01', uploadDate: new Date().toISOString(), fileName: 'ley_aduanera.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1024 * 500, aiSummary: 'Este documento detalla las regulaciones para la entrada y salida de mercancías del territorio nacional, incluyendo las obligaciones de los importadores, exportadores y agentes aduanales.' },
    { id: 'cdoc-2', title: 'RGCE 2024 - Anexo 22', description: 'Instructivo de llenado del pedimento.', category: 'RGCE', publicationDate: '2024-03-15', uploadDate: new Date().toISOString(), fileName: 'anexo_22.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1024 * 200, aiSummary: 'El Anexo 22 establece las claves y formatos que deben utilizarse para el correcto llenado de los pedimentos aduanales, siendo fundamental para la correcta declaración de mercancías.' }
];

export const getMockLoginUsers = (): UserProfile[] => {
    return MOCK_USERS;
}

export const getMockDataForUser = async (userId: string) => {
    // In a real app, this would fetch data from Firebase based on the user's companyId.
    // Here we return the same mock data for everyone.
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency
    return {
        company: MOCK_COMPANY,
        companyUsers: MOCK_USERS,
        events: MOCK_CALENDAR_EVENTS,
        obligations: MOCK_OBLIGATIONS,
        notifications: MOCK_NOTIFICATIONS,
        taskCategories: MOCK_TASK_CATEGORIES,
        complianceDocuments: MOCK_COMPLIANCE_DOCS
    };
};
