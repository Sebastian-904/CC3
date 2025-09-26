export const translations = {
    // General
    logout: "Cerrar Sesión",
    settings: "Configuración",
    saveChanges: "Guardar Cambios",
    refresh: "Refrescar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    
    // Login Page
    loginPageTitle: "Selecciona un perfil para iniciar sesión como un usuario simulado.",
    loginPageDescription: "Plataforma de gestión de cumplimiento para comercio exterior.",
    loginSuccessTitle: "Inicio de Sesión Exitoso",
    loginSuccessDesc: "Bienvenido de nuevo.",
    loginFailedTitle: "Error de Inicio de Sesión",
    loginFailedDesc: "No se pudo iniciar sesión. Por favor, intenta de nuevo.",
    roleAdmin: "Administrador",
    roleConsultant: "Consultor",
    roleClient: "Cliente",

    // Sidebar
    sidebarDashboard: "Dashboard",
    sidebarCompanyProfile: "Perfil de Empresa",
    sidebarObligations: "Obligaciones",
    sidebarReports: "Reportes",
    sidebarUsers: "Usuarios",
    sidebarLibrary: "Biblioteca",
    sidebarSettings: "Configuración",
    sidebarQuickStart: "Guía Rápida",

    // Settings Page
    myProfile: "Mi Perfil",
    updateProfileInfo: "Actualiza la información de tu perfil.",
    displayName: "Nombre de Usuario",
    emailAddress: "Correo Electrónico",
    emailNotifications: "Notificaciones por Correo",
    manageEmailNotifications: "Administra qué correos recibes.",
    taskAssigned: "Tarea Asignada",
    taskAssignedDesc: "Recibir correo cuando se te asigna una nueva tarea.",
    taskDue: "Vencimiento de Tarea",
    taskDueDesc: "Recibir un recordatorio cuando una tarea está por vencer.",
    displayPreferences: "Preferencias de Pantalla",
    customizeAppearance: "Personaliza la apariencia de la aplicación.",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",

    // AI Assistant
    aiAssistant: "Asistente de IA",
    aiAssistantDesc: "Haz preguntas o crea tareas usando lenguaje natural.",
    aiAssistantWelcome: "¡Hola! Soy tu asistente de cumplimiento. ¿Cómo puedo ayudarte hoy? Puedes pedirme que cree una tarea, por ejemplo: 'Crea un recordatorio para revisar los pedimentos de importación para el próximo viernes'.",
    aiAssistantPlaceholder: "Escribe tu mensaje...",
    aiAssistantTaskAdded: "¡Hecho! He agregado la tarea '{taskTitle}' a tu calendario.",
    addToCalendar: "Agregar al Calendario",

    // Compliance News Feed
    complianceNewsFeed: "Noticias de Cumplimiento",
    complianceNewsFeedDesc: "Últimas noticias y actualizaciones relevantes para tu empresa.",
    searchingUpdates: "Buscando actualizaciones...",
    fetchNewsError: "Error al obtener noticias",
    promptForNews: "Haz clic en 'Refrescar' para buscar noticias de cumplimiento.",
    sources: "Fuentes",
    reviewComplianceUpdate: "Revisar Actualización de Cumplimiento",
    createTaskFromUpdate: "Crear Tarea desde esta Actualización",

    // Library
    complianceLibrary: "Biblioteca de Cumplimiento",
    complianceLibraryDesc: "Busca y gestiona documentos legales y de cumplimiento.",
    uploadLegalDocument: "Subir Documento Legal",
    publicationDate: "Fecha de Publicación",
    documentCategory: "Categoría del Documento",
    generateAISummary: "Generar Resumen con IA",
    generateAISummaryDesc: "Analiza el documento para crear un resumen automático.",

    // Notifications
    notifications: "Notificaciones",
    markAllAsRead: "Marcar todas como leídas",
    noNotifications: "No tienes notificaciones nuevas.",
    viewAllNotifications: "Ver todas las notificaciones",

    // Quick Start Guide
    quickStartTitle: "Guía de Inicio Rápido",
    quickStartDesc: "Bienvenido a CompliancePro. Aquí tienes una guía para empezar.",
    quickStartWelcome: "Bienvenido a CompliancePro. Como usuario, tu rol es clave para mantener la operación en cumplimiento. Aquí te mostramos los primeros pasos:",
    consultantGuideTitle: "Guía para Consultores y Administradores",
    consultantGuide1: "El Dashboard es tu centro de control. Revisa los KPIs, el calendario y las noticias de cumplimiento para mantenerte al día.",
    consultantGuide2: "Ve a 'Perfil de Empresa' para configurar los datos de tu cliente. Usa el 'AI Profile Importer' en la página de 'Reportes' para extraer datos automáticamente de documentos como el Acta Constitutiva.",
    consultantGuide3: "Sube leyes, reglamentos y decretos relevantes a la 'Biblioteca de Cumplimiento'. La IA puede generar resúmenes para una referencia rápida.",
    consultantGuide4: "En la sección de 'Usuarios', puedes invitar a miembros del equipo de tu cliente y asignarles roles.",
    clientGuideTitle: "Guía para Clientes",
    clientGuide1: "El Dashboard te ofrece una vista rápida de tus tareas pendientes, completadas y vencidas. Usa el calendario para planificar tus actividades.",
    clientGuide2: "En 'Perfil de Empresa', puedes consultar toda la información legal y de programas que tu consultor ha registrado. Mantén esta información actualizada.",
    clientGuide3: "La 'Biblioteca' contiene los documentos legales relevantes para tu operación. Puedes consultarlos en cualquier momento.",
    uploadDocument: "Subir Documento",
};

export type TranslationKey = keyof typeof translations;
