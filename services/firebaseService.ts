import { UserProfile, Company, CalendarEvent, TaskCategory, Obligation, Notification, ComplianceDocument } from "../lib/types";

// Mock Data

const mockUsers: UserProfile[] = [
    { uid: 'user-1', email: 'admin@compliance.pro', displayName: 'Admin User', role: 'admin', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: true } },
    { uid: 'user-2', email: 'consultor@compliance.pro', displayName: 'Consultor User', role: 'consultor', companyId: 'comp-1', emailPreferences: { taskAssigned: true, taskDue: false } },
    { uid: 'user-3', email: 'cliente@compliance.pro', displayName: 'Client User', role: 'cliente', companyId: 'comp-1', emailPreferences: { taskAssigned: false, taskDue: true } },
];

const mockCompanies: Company[] = [
    {
        id: 'comp-1',
        name: 'TechSolutions S.A. de C.V.',
        general: {
            datosFiscales: { razonSocial: 'TechSolutions S.A. de C.V.', rfc: 'TSO123456XYZ', domicilioFiscal: 'Av. Innovación 123, Parque Tecnológico, Querétaro, Qro.', telefono: '442-555-0101' },
            actaConstitutiva: { numeroEscritura: '54321', fecha: '2010-05-20', notarioPublico: 'Lic. Juan Pérez' },
            representanteLegal: { nombre: 'Ana García', rfc: 'GAAA800101ABC' }
        },
        programas: {
            immex: { numeroRegistro: 'IMX-9876', modalidad: 'Industrial', fechaAutorizacion: '2011-01-15' },
            prosec: { numeroRegistro: 'PRO-5432', sector: 'Electrónico', fechaAutorizacion: '2011-02-01' }
        },
        miembros: [{ id: 'm-1', nombre: 'Carlos Sánchez', rfc: 'SACJ750315DEF' }],
        domicilios: [{ id: 'd-1', direccionCompleta: 'Planta 1, Av. Industrial 456, Querétaro', telefono: '442-555-0102' }],
        agentesAduanales: [{ id: 'aa-1', nombre: 'Agencia Aduanal Rápida', numeroPatente: '3001', estadoEncargo: 'Activo' }],
        documents: [
            { id: 'doc-1', name: 'Acta_Constitutiva.pdf', url: '#', type: 'application/pdf', size: 1200000, uploadDate: '2023-01-10', category: 'Legal' },
            { id: 'doc-2', name: 'IMMEX_Autorizacion.pdf', url: '#', type: 'application/pdf', size: 850000, uploadDate: '2023-02-15', category: 'IMMEX' },
        ]
    }
];

const mockTaskCategories: TaskCategory[] = [
    { id: 'cat-1', name: 'Fiscal', companyId: 'comp-1' },
    { id: 'cat-2', name: 'Aduanero', companyId: 'comp-1' },
    { id: 'cat-3', name: 'Corporativo', companyId: 'comp-1' },
    { id: 'cat-4', name: 'Laboral', companyId: 'comp-1' },
]

const mockEvents: CalendarEvent[] = [
    { id: 'evt-1', companyId: 'comp-1', title: 'Declaración Anual', description: 'Presentar declaración anual de impuestos.', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], status: 'pending', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-2', companyId: 'comp-1', title: 'Pago de IVA', description: 'Realizar pago mensual de IVA.', dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0], status: 'overdue', priority: 'high', category: 'cat-1', reminders: [] },
    { id: 'evt-3', companyId: 'comp-1', title: 'Revisión de Contratos', description: 'Revisar contratos con proveedores.', dueDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0], status: 'pending', priority: 'medium', category: 'cat-3', reminders: [] },
    { id: 'evt-4', companyId: 'comp-1', title: 'Auditoría Interna', description: 'Completar auditoría de procesos aduaneros.', dueDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], status: 'completed', priority: 'medium', category: 'cat-2', reminders: [] },
];

const mockObligations: Obligation[] = [
    { id: 'ob-1', companyId: 'comp-1', title: 'Reporte Mensual IMMEX', description: 'Generar y presentar el reporte de operaciones IMMEX.', category: 'cat-2', frequency: 'monthly', status: 'active' },
    { id: 'ob-2', companyId: 'comp-1', title: 'Declaración Trimestral ISR', description: 'Presentar pagos provisionales de ISR.', category: 'cat-1', frequency: 'quarterly', status: 'active' },
];

const mockNotifications: Notification[] = [
  { id: 'notif-1', type: 'TASK_OVERDUE', message: 'Task "Pago de IVA" is overdue.', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), isRead: false },
  { id: 'notif-2', type: 'TASK_DUE', message: 'Task "Declaración Anual" is due in 10 days.', timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: false },
  { id: 'notif-3', type: 'TASK_ASSIGNED', message: 'You have been assigned the task "Revisión de Contratos".', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), isRead: true },
];

const mockComplianceDocs: ComplianceDocument[] = [
  { id: 'cdoc-1', title: 'Ley Aduanera', description: 'Ley que regula la entrada y salida de mercancías del territorio nacional.', category: 'Ley', publicationDate: '2023-12-15', fileName: 'ley_aduanera_2023.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 2500000, uploadDate: '2024-01-01', aiSummary: '• Regulates customs operations.\n• Establishes tariffs and customs regimes.\n• Defines infractions and sanctions.' },
  { id: 'cdoc-2', title: 'Reglamento de la Ley Aduanera', description: 'Disposiciones aplicables a la Ley Aduanera.', category: 'Reglamento', publicationDate: '2024-01-20', fileName: 'reglamento_la_2024.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 1800000, uploadDate: '2024-02-01', aiSummary: '• Details procedures for customs clearance.\n• Specifies documentation requirements.\n• Expands on temporary importation rules.' },
];

// Mock API Functions

export const getMockLoginUsers = (): UserProfile[] => mockUsers;

export const getMockUserByEmail = (email: string): UserProfile | undefined => mockUsers.find(u => u.email === email);

export const getMockCompany = (companyId: string): Company | undefined => mockCompanies.find(c => c.id === companyId);

export const getMockCompanyUsers = (companyId: string): UserProfile[] => mockUsers.filter(u => u.companyId === companyId);

export const getMockEvents = (companyId: string): CalendarEvent[] => mockEvents.filter(e => e.companyId === companyId);

export const getMockTaskCategories = (companyId: string): TaskCategory[] => mockTaskCategories.filter(c => c.companyId === companyId);

export const getMockObligations = (companyId: string): Obligation[] => mockObligations.filter(o => o.companyId === companyId);

export const getMockNotifications = (): Notification[] => mockNotifications;

export const getMockComplianceDocs = (): ComplianceDocument[] => mockComplianceDocs;
