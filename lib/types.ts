
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    role: 'admin' | 'consultor' | 'employee';
    companyId?: string; // Added to link employees to a company
}

export type EventStatus = 'completed' | 'pending' | 'overdue';
export type EventPriority = 'high' | 'medium' | 'low';

export interface Attachment {
    id: string;
    name: string;
    url: string; // or use blob/base64
    size: number; // in bytes
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    timestamp: string; // ISO string
    text: string;
}


export interface CalendarEvent {
    id: string;
    title: string;
    dueDate: string; // YYYY-MM-DD
    status: EventStatus;
    priority: EventPriority;
    category: string; // category id
    description: string;
    companyId: string;
    assigneeId?: string; // Added for task assignment
    attachments?: Attachment[];
    comments?: Comment[];
}

export interface TaskCategory {
    id: string;
    name: string;
    color: string; // e.g., 'bg-blue-500'
}

export interface Notification {
    id: string;
    userId: string;
    type: 'TASK_DUE' | 'TASK_ASSIGNED' | 'TASK_OVERDUE' | 'COMMENT_MENTION';
    message: string;
    isRead: boolean;
    timestamp: string; // ISO string
    linkTo?: string; // e.g., an event ID
}


// FIX: Replaced `dayOfMonth` with `dueDate` to align with UI components
// and fix a runtime error when rendering the obligations list.
export interface Obligation {
    id: string;
    title: string;
    category: string;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    dueDate: string; // Descriptive due date rule, e.g., "17th of each month"
    status: 'active' | 'inactive';
    companyId: string;
    assigneeId?: string;
    description?: string;
}

export interface AITaskSuggestion {
    isTaskSuggestion: boolean;
    task: {
        title: string;
        dueDate: string; // YYYY-MM-DD
        description: string;
    };
}

// Based on CompanyProfilePage.tsx
export interface Company {
    id: string;
    name: string;
    general: {
        datosFiscales: {
            razonSocial: string;
            rfc: string;
            actividadEconomica: string;
            telefono: string;
            domicilioFiscal: string;
        };
        actaConstitutiva: {
            numeroEscritura: string;
            fecha: string;
            nombreFedatario: string;
        };
        representanteLegal: {
            numeroEscrituraPoder: string;
            fechaPoder: string;
            nombreFedatario: string;
        };
    };
    programas: {
        immex?: {
            numeroRegistro: string;
            modalidad: string;
            fechaAutorizacion: string;
        };
        prosec?: {
            numeroRegistro: string;
            sector: string;
            fechaAutorizacion: string;
        };
        certificacionIVAYIEPS?: {
            folio: string;
            rubro: string;
            resolucion: string;
            proximaRenovacion: string;
        };
        padronImportadores?: {
            folio: string;
            fechaRegistro: string;
            sector: string;
        };
    };
    miembros: {
        id: string;
        nombre: string;
        rfc: string;
        tipoPersona: 'Física' | 'Moral';
        caracter: string;
        nacionalidad: string;
        tributaEnMexico: boolean;
    }[];
    domicilios: {
        id: string;
        direccionCompleta: string;
        telefono: string;
        programaVinculado: string;
    }[];
    agentesAduanales: {
        id: string;
        nombre: string;
        numeroPatente: string;
        estadoEncargo: string;
    }[];
}