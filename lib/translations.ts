export const translations = {
  // Sidebar
  sidebarDashboard: 'Dashboard',
  sidebarCompanyProfile: 'Perfil de la Empresa',
  sidebarObligations: 'Matriz de Obligaciones',
  sidebarReports: 'Reportes',
  sidebarUsers: 'Usuarios',
  sidebarLibrary: 'Biblioteca de Cumplimiento',
  sidebarSettings: 'Configuración',
  sidebarQuickStart: 'Guía Rápida',

  // Login Page
  loginPageDescription: 'Inicia sesión para gestionar tu cumplimiento.',
  loginPageTitle: 'Selecciona un perfil para simular el inicio de sesión.',
  loginSuccessTitle: '¡Bienvenido!',
  loginSuccessDesc: 'Has iniciado sesión correctamente.',
  loginFailedTitle: 'Error de Autenticación',
  loginFailedDesc: 'No se pudo iniciar sesión. Intenta de nuevo.',
  roleAdmin: 'Administrador',
  roleConsultant: 'Consultor',
  roleClient: 'Cliente',

  // AI Assistant
  aiAssistant: 'Asistente IA',
  aiAssistantDesc: 'Haz preguntas o pide crear tareas.',
  aiAssistantWelcome: '¡Hola! Soy tu asistente de cumplimiento. ¿En qué puedo ayudarte hoy? Puedes pedirme que cree una tarea, por ejemplo: "Recuérdame presentar la declaración mensual el próximo viernes".',
  aiAssistantPlaceholder: 'Escribe tu pregunta o solicitud...',
  aiAssistantTaskAdded: '¡Hecho! La tarea "{taskTitle}" ha sido añadida a tu calendario.',
  addToCalendar: 'Añadir al Calendario',

  // Settings Page
  settings: 'Configuración',
  myProfile: 'Mi Perfil',
  updateProfileInfo: 'Actualiza tu información de perfil.',
  displayName: 'Nombre de Usuario',
  emailAddress: 'Correo Electrónico',
  saveChanges: 'Guardar Cambios',
  emailNotifications: 'Notificaciones por Correo',
  manageEmailNotifications: 'Gestiona qué correos quieres recibir.',
  taskAssigned: 'Tarea Asignada',
  taskAssignedDesc: 'Recibir un correo cuando se te asigne una nueva tarea.',
  taskDue: 'Vencimiento de Tarea',
  taskDueDesc: 'Recibir recordatorios de tareas próximas a vencer.',
  displayPreferences: 'Preferencias de Visualización',
  customizeAppearance: 'Personaliza la apariencia de la aplicación.',
  theme: 'Tema',
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',

  // Notifications
  notifications: 'Notificaciones',
  markAllAsRead: 'Marcar todo como leído',
  noNotifications: 'No tienes notificaciones nuevas.',
  viewAllNotifications: 'Ver todas las notificaciones',

  // Compliance News Feed
  complianceNewsFeed: 'Noticias de Cumplimiento',
  complianceNewsFeedDesc: 'Actualizaciones relevantes impulsadas por IA.',
  refresh: 'Actualizar',
  searchingUpdates: 'Buscando actualizaciones...',
  fetchNewsError: 'Error al buscar noticias.',
  promptForNews: 'Haz clic en Actualizar para buscar las últimas noticias de cumplimiento.',
  sources: 'Fuentes',
  reviewComplianceUpdate: 'Revisar actualización de cumplimiento',
  createTaskFromUpdate: 'Crear Tarea desde Actualización',

  // Document Upload
  uploadDocument: 'Subir Documento',
  documentCategory: 'Categoría del Documento',
  
  // Compliance Library
  complianceLibrary: 'Biblioteca de Cumplimiento',
  complianceLibraryDesc: 'Busca y gestiona documentos legales y de cumplimiento.',
  uploadLegalDocument: 'Subir Documento Legal',
  publicationDate: 'Fecha de Publicación',
  generateAISummary: 'Generar Resumen con IA',
  generateAISummaryDesc: 'Analiza el documento para crear un resumen de puntos clave.',

  // Company Profile Page
  edit: 'Editar',
  manage: 'Gestionar',
  upload: 'Subir',
  razonSocial: 'Razón Social',
  phone: 'Teléfono',
  domicilioFiscal: 'Domicilio Fiscal',
  noProgramsRegistered: 'No hay programas registrados.',
  noDocumentsUploaded: 'No se han subido documentos.',
  profileNavGeneral: 'General',
  profileNavPrograms: 'Programas',
  profileNavMembers: 'Miembros',
  profileNavAddresses: 'Domicilios',
  profileNavAgents: 'Agentes Aduanales',
  profileNavDocuments: 'Documentos',

};

export type TranslationKey = keyof typeof translations;