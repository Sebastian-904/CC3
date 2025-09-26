// lib/types.ts

export type UserRole = 'admin' | 'consultor' | 'cliente';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    companyId: string;
    emailPreferences: {
        taskAssigned: boolean;
        taskDue: boolean;
    };
}

export interface Company {
    id: string;
    name: string;
    general: {
        datosFiscales: {
            razonSocial: string;
            rfc: string;
            domicilioFiscal: string;
            telefono: string;
        };
        actaConstitutiva: {
            numeroEscritura: string;
            fecha: string;
            notarioPublico: string;
        };
        representanteLegal: {
            nombre: string;
            poderNotarial: string;
        };
    };
    programas: {
        immex?: {
            numeroRegistro: string;
            tipo: string;
        };
        prosec?: {
            numeroRegistro: string;
            sector: string;
        };
        // Add other programs as needed
    };
    domicilios: { id: string; direccionCompleta: string; telefono: string }[];
    miembros: { id: string; nombre: string; rfc: string }[];
    agentesAduanales: { id: string; nombre: string; numeroPatente: string; estadoEncargo: 'Activo' | 'Inactivo' }[];
    // Add other fields as needed
}

export type EventStatus = 'pending' | 'completed' | 'overdue';
export type EventPriority = 'low' | 'medium' | 'high';

export interface CalendarEvent {
    id: string;
    companyId: string;
    title: string;
    description: string;
    dueDate: string; // YYYY-MM-DD
    status: EventStatus;
    priority: EventPriority;
    category: string; // Corresponds to TaskCategory id
    reminders: string[]; // e.g., '1d', '2h'
}

export type ObligationFrequency = 'monthly' | 'quarterly' | 'yearly';
export type ObligationStatus = 'active' | 'inactive';

export interface Obligation {
    id: string;
    companyId: string;
    title: string;
    description: string;
    category: string; // Corresponds to TaskCategory id
    frequency: ObligationFrequency;
    status: ObligationStatus;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'TASK_ASSIGNED' | 'TASK_DUE' | 'TASK_OVERDUE' | 'COMMENT_MENTION' | 'TASK_REMINDER';
    message: string;
    isRead: boolean;
    timestamp: string; // ISO 8601
}

export interface TaskCategory {
    id: string;
    name: string;
}

export interface AITaskSuggestion {
    isTaskSuggestion: true;
    task: {
        title: string;
        description:string;
        dueDate: string; // YYYY-MM-DD
    };
}

export interface AIExtractedField<T> {
    value: T;
    confidence: number;
}

export interface AIExtractedCompany {
    name: AIExtractedField<string>;
    general: {
        datosFiscales: {
            razonSocial: AIExtractedField<string>;
            rfc: AIExtractedField<string>;
        }
    }
}

export type ComplianceDocumentCategory = 'Ley' | 'Reglamento' | 'Decreto' | 'Acuerdo' | 'RGCE' | 'Criterio' | 'Otro';

export interface ComplianceDocument {
    id: string;
    title: string;
    description: string;
    category: ComplianceDocumentCategory;
    publicationDate: string; // YYYY-MM-DD
    uploadDate: string; // ISO 8601
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number; // in bytes
    aiSummary?: string;
}
