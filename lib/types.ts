
// ---
// title: lib/types.ts
// ---
export type UserRole = 'admin' | 'consultor' | 'cliente';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: UserRole;
  companyId: string;
  companyName?: string;
  emailPreferences: {
    taskAssigned: boolean;
    taskDue: boolean;
    commentMention: boolean;
    dailySummary: boolean;
  };
}

export type EventStatus = 'pending' | 'completed' | 'overdue';
export type EventPriority = 'low' | 'medium' | 'high';

export type ReminderTime = '30m' | '1h' | '1d';

export interface Reminder {
    id: string;
    time: ReminderTime;
}

export interface Attachment {
  id: string;
  name: string;
  url: string; // In a real app, this would be a download URL
  type: string; // e.g., 'application/pdf'
}

export interface CalendarEvent {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  description: string;
  category: string; // category id
  priority: EventPriority;
  status: EventStatus;
  assigneeId?: string;
  companyId: string;
  reminders: Reminder[];
  attachments?: Attachment[];
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number; // in bytes
  uploadDate: string; // ISO string
  category: string; // e.g., 'Fiscal', 'Legal'
}

export interface Company {
  id: string;
  name: string;
  general: {
    datosFiscales: {
      razonSocial: string;
      rfc: string;
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
    immex?: { numeroRegistro: string; modalidad: string; fechaAutorizacion: string; };
    prosec?: { numeroRegistro: string; sector: string; fechaAutorizacion: string; };
    certificacionIVAYIEPS?: { folio: string; rubro: string; resolucion: string; proximaRenovacion: string; };
    padronImportadores?: { folio: string; fechaRegistro: string; sector: string; };
  };
  miembros: { id: string; nombre: string; rfc: string; tipoPersona: 'Física' | 'Moral'; caracter: string; nacionalidad: string; tributaEnMexico: boolean; }[];
  domicilios: { id: string; direccionCompleta: string; telefono: string; programaVinculado: string; }[];
  agentesAduanales: { id: string; nombre: string; numeroPatente: string; estadoEncargo: 'Activo' | 'Pendiente' | 'Revocado' }[];
  documents?: Document[];
}

export interface AITaskSuggestion {
  isTaskSuggestion: true;
  task: {
    title: string;
    dueDate: string; // YYYY-MM-DD
    description: string;
  };
}

export interface Notification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_DUE' | 'TASK_OVERDUE' | 'COMMENT_MENTION' | 'TASK_REMINDER';
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  relatedId?: string; // e.g., event ID
}

export type ObligationFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface Obligation {
    id: string;
    companyId: string;
    title: string;
    description: string;
    category: string; // category id
    frequency: ObligationFrequency;
    dayOfMonth?: string; // '1'-'31' or 'last'
    month?: string; // '1'-'12' for yearly
    assigneeId?: string;
    status: 'active' | 'inactive';
}

// Types for AI Data Extraction with confidence and source
interface WithAIExtra<T> {
    value: T;
    confidence: number; // 0-1
    source: string;
}

export type AIExtractedCompany = {
    name: WithAIExtra<string>;
    general: {
        datosFiscales: {
            razonSocial: WithAIExtra<string>;
            rfc: WithAIExtra<string>;
            telefono: WithAIExtra<string>;
            domicilioFiscal: WithAIExtra<string>;
        };
        actaConstitutiva: {
            numeroEscritura: WithAIExtra<string>;
            fecha: WithAIExtra<string>;
            nombreFedatario: WithAIExtra<string>;
        };
        representanteLegal: {
            numeroEscrituraPoder: WithAIExtra<string>;
            fechaPoder: WithAIExtra<string>;
            nombreFedatario: WithAIExtra<string>;
        };
    };
    programas: {
        immex?: {
            numeroRegistro: WithAIExtra<string>;
            modalidad: WithAIExtra<string>;
            fechaAutorizacion: WithAIExtra<string>;
        };
        prosec?: {
            numeroRegistro: WithAIExtra<string>;
            sector: WithAIExtra<string>;
            fechaAutorizacion: WithAIExtra<string>;
        };
    };
    miembros: {
        nombre: WithAIExtra<string>;
        rfc: WithAIExtra<string>;
    }[];
    domicilios: {
        direccionCompleta: WithAIExtra<string>;
        telefono: WithAIExtra<string>;
    }[];
    agentesAduanales: {
        nombre: WithAIExtra<string>;
        numeroPatente: WithAIExtra<string>;
    }[];
};
