
export type UserRole = 'admin' | 'consultor' | 'cliente';

export interface EmailPreferences {
  taskAssigned: boolean;
  taskDue: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  companyId: string;
  emailPreferences: EmailPreferences;
}

export interface GeneralData {
  datosFiscales: {
    razonSocial: string;
    rfc: string;
    domicilioFiscal: string;
    telefono: string;
  };
}

export interface ProgramDetail {
  numeroRegistro: string;
  modalidad?: string;
  sector?: string;
  fechaAutorizacion: string;
}

export interface Programs {
  immex?: ProgramDetail;
  prosec?: ProgramDetail;
}

export interface Member {
  id: string;
  nombre: string;
  rfc: string;
}

export interface Address {
  id: string;
  tipo: string;
  direccionCompleta: string;
  telefono: string;
}

export interface CustomsAgent {
  id: string;
  nombre: string;
  numeroPatente: string;
  estadoEncargo: 'Activo' | 'Inactivo';
}

export interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadDate: string;
    category: string;
}

export interface Company {
  id: string;
  name: string;
  general: GeneralData;
  programas: Programs;
  miembros: Member[];
  domicilios: Address[];
  agentesAduanales: CustomsAgent[];
  documents: Document[];
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
  reminders: string[];
}

export interface TaskCategory {
    id: string;
    name: string;
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
    timestamp: string; // ISO string
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
    uploadDate: string; // ISO string
    aiSummary?: string;
}

export interface AITaskSuggestion {
    isTaskSuggestion: true;
    task: {
        title: string;
        description: string;
        dueDate: string; // YYYY-MM-DD
    };
}

export interface AIExtractedField {
    value: string;
    confidence: number;
}

export interface AIExtractedCompany {
    name: AIExtractedField;
    general: {
        datosFiscales: {
            razonSocial: AIExtractedField;
            rfc: AIExtractedField;
        }
    };
}
