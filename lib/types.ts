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
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
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
  type: 'TASK_ASSIGNED' | 'TASK_DUE' | 'TASK_OVERDUE' | 'COMMENT_MENTION';
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
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
