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

export type EventStatus = 'pending' | 'completed' | 'overdue';
export type EventPriority = 'low' | 'medium' | 'high';

export interface TaskCategory {
    id: string;
    name: string;
    companyId: string;
}

export interface CalendarEvent {
  id: string;
  companyId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: EventStatus;
  priority: EventPriority;
  category: string; // category id
  reminders: string[];
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
          rfc: string;
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
  };
  miembros: { id: string; nombre: string; rfc: string }[];
  domicilios: { id: string; direccionCompleta: string; telefono: string }[];
  agentesAduanales: { id: string; nombre: string; numeroPatente: string; estadoEncargo: 'Activo' | 'Inactivo' }[];
  documents: CompanyDocument[];
}

export interface CompanyDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
}

export interface AITaskSuggestion {
    isTaskSuggestion: true;
    task: {
        title: string;
        description: string;
        dueDate: string; // YYYY-MM-DD
    };
}

export type ObligationFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface Obligation {
    id: string;
    companyId: string;
    title: string;
    description: string;
    category: string;
    frequency: ObligationFrequency;
    status: 'active' | 'inactive';
}

export interface Notification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_DUE' | 'TASK_OVERDUE' | 'COMMENT_MENTION' | 'TASK_REMINDER';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  category: 'Ley' | 'Reglamento' | 'Decreto' | 'Acuerdo' | 'RGCE' | 'Criterio' | 'Otro';
  publicationDate: string; // YYYY-MM-DD
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  aiSummary?: string;
}

interface ExtractedField<T> {
  value: T;
  confidence: number;
}

export interface AIExtractedCompany {
  name: ExtractedField<string>;
  general: {
      datosFiscales: {
          razonSocial: ExtractedField<string>;
          rfc: ExtractedField<string>;
      }
  };
}
