import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import { FileText, FileDown, FileUp, Shield, BarChart2, Loader2 } from 'lucide-react';
import ReportPreviewDialog from '../components/reports/ReportPreviewDialog';
import { getAllUsers } from '../services/firebaseService';
import { UserProfile, CalendarEvent } from '../lib/types';
import DashboardKPIs from '../components/dashboard/DashboardKPIs';

const ReportsPage = () => {
    const { user } = useAuth();
    const { activeCompany, events, taskCategories, companyUsers } = useApp();
    const isAdminOrConsultant = user?.role === 'admin' || user?.role === 'consultor';
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const [dateRange, setDateRange] = useState({ from: firstDayOfMonth, to: todayStr });
    const [reportContent, setReportContent] = useState<React.ReactNode | null>(null);
    const [reportTitle, setReportTitle] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const generateMonthlySummary = () => {
        if (!activeCompany) return;
        const monthEvents = events.filter(e => {
            const eventDate = new Date(e.dueDate);
            return eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth();
        });

        setReportTitle(`Resumen de Actividad Mensual - ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
        setReportContent(
            <div className="space-y-6">
                <DashboardKPIs events={monthEvents} />
                <h3 className="text-xl font-semibold pt-4 border-t mt-6">Listado Detallado de Tareas</h3>
                <ReportTable events={monthEvents} />
            </div>
        );
    };
    
    const generatePendingByCategory = () => {
        if (!activeCompany) return;
        const pendingEvents = events.filter(e => e.status === 'pending' || e.status === 'overdue');
        const grouped = pendingEvents.reduce((acc, event) => {
            const categoryName = taskCategories.find(c => c.id === event.category)?.name || 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);

        setReportTitle('Reporte de Tareas Pendientes por Categoría');
        setReportContent(
            <div className="space-y-8">
                {Object.entries(grouped).map(([categoryName, categoryEvents]) => (
                    <div key={categoryName}>
                        <h3 className="text-xl font-semibold mb-3">{categoryName}</h3>
                        <ReportTable events={categoryEvents} />
                    </div>
                ))}
            </div>
        );
    };

    const generateDuesByRange = () => {
        if(!activeCompany) return;
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        to.setHours(23, 59, 59, 999); // Include the whole end day

        const rangeEvents = events.filter(e => {
            const eventDate = new Date(e.dueDate);
            return eventDate >= from && eventDate <= to;
        }).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        setReportTitle(`Vencimientos del ${dateRange.from} al ${dateRange.to}`);
        setReportContent(<ReportTable events={rangeEvents} />);
    };
    
    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleDownloadTemplate = () => {
        const headers = [
            // General
            "razonSocial", "rfc", "actividadEconomica", "telefono", "domicilioFiscal",
            "numeroEscrituraActa", "fechaActa", "nombreFedatarioActa",
            "numeroEscrituraPoder", "fechaPoder", "nombreFedatarioPoder",
            // Programas
            "immexNumero", "immexModalidad", "immexFecha",
            "prosecNumero", "prosecSector", "prosecFecha",
            // Miembros
            "miembroNombre", "miembroRfc", "miembroTipo", "miembroCaracter", "miembroNacionalidad", "miembroTributaMexico",
            // Domicilios
            "domicilioDireccion", "domicilioTelefono", "domicilioPrograma",
            // Agentes
            "agenteNombre", "agentePatente", "agenteEstado"
        ];
        downloadCSV(headers.join(','), 'plantilla_empresa.csv');
    };

    const handleDownloadAccessCsv = async () => {
        setIsDownloading(true);
        try {
            const allUsers = await getAllUsers();
            const headers = ["displayName", "email", "role", "companyName"];
            const csvContent = [
                headers.join(','),
                ...allUsers.map(u => [u.displayName, u.email, u.role, u.companyName || 'N/A'].join(','))
            ].join('\n');
            downloadCSV(csvContent, 'reporte_accesos_global.csv');
        } catch (error) {
            console.error("Failed to download access report", error);
            alert("Could not download the report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };


    const ReportTable: React.FC<{events: CalendarEvent[]}> = ({ events }) => (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Título</th>
                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Responsable</th>
                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => {
                        const assignee = companyUsers.find(u => u.uid === event.assigneeId);
                        return (
                            <tr key={event.id} className="border-b dark:border-gray-700 last:border-b-0">
                                <td className="p-3">{event.dueDate}</td>
                                <td className="p-3 font-medium">{event.title}</td>
                                <td className="p-3 text-gray-500 dark:text-gray-400">{assignee?.displayName || 'N/A'}</td>
                                <td className="p-3 capitalize">{event.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart2 className="h-6 w-6" /> Reports & Data Management</h1>
                    <p className="text-muted-foreground">Generate reports, manage bulk data, and perform administrative tasks.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>PDF Reports</CardTitle>
                        <CardDescription>Generate professional PDF reports for analysis and sharing.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ReportCard
                            title="Resumen de Actividad Mensual"
                            description="A complete overview of the current month's performance and task status."
                            onClick={generateMonthlySummary}
                        />
                        <ReportCard
                            title="Pendientes por Categoría"
                            description="Identifies bottlenecks by grouping all pending tasks by category."
                            onClick={generatePendingByCategory}
                        />
                        <div className="bg-muted/50 p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <h4 className="font-semibold">Vencimientos por Rango de Fechas</h4>
                                <p className="text-sm text-muted-foreground mt-1 mb-3">A flexible report to plan for a specific period.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium">From</label>
                                        <Input type="date" value={dateRange.from} onChange={e => setDateRange(prev => ({...prev, from: e.target.value}))} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">To</label>
                                        <Input type="date" value={dateRange.to} onChange={e => setDateRange(prev => ({...prev, to: e.target.value}))} />
                                    </div>
                                </div>
                                <Button className="w-full" onClick={generateDuesByRange}>
                                    <FileDown className="mr-2 h-4 w-4" /> Generate Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Import / Export (Excel)</CardTitle>
                        <CardDescription>Manage bulk data using Excel files for efficiency.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <ReportCard
                            icon={<FileDown />}
                            title="Descargar Plantilla de Empresas"
                            description="Get the master CSV template to fill in and onboard a new client quickly."
                            onClick={handleDownloadTemplate}
                        />
                        <ReportCard
                            icon={<FileUp />}
                            title="Importar desde Excel"
                            description="Upload a completed template to populate a company's profile, obligations, and tasks."
                            isUpload={true}
                            onFileChange={(e) => alert(`File "${e.target.files?.[0]?.name}" selected. Ready for processing.`)}
                        />
                    </CardContent>
                </Card>

                {isAdminOrConsultant && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Shield /> Administration Tools</CardTitle>
                            <CardDescription>High-level tools for platform management and security audits.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReportCard
                                icon={<FileDown />}
                                title="Descargar Todos los Accesos (CSV)"
                                description="Generate a security report listing all users, their roles, and their assigned companies across the platform."
                                onClick={handleDownloadAccessCsv}
                                isDownloading={isDownloading}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            <ReportPreviewDialog
                isOpen={!!reportContent}
                onClose={() => setReportContent(null)}
                title={reportTitle}
                companyName={activeCompany?.name || ''}
            >
                {reportContent}
            </ReportPreviewDialog>
        </>
    );
};


interface ReportCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    isUpload?: boolean;
    onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDownloading?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, onClick, isUpload = false, onFileChange, isDownloading = false }) => (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col justify-between">
        <div>
            <h4 className="font-semibold flex items-center gap-2">{icon || <FileText className="h-4 w-4 text-primary" />} {title}</h4>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
        </div>
        {isUpload ? (
            <Button as="label" className="w-full cursor-pointer">
                <FileUp className="mr-2 h-4 w-4" /> Select File to Import
                <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={onFileChange} />
            </Button>
        ) : (
            <Button onClick={onClick} className="w-full" disabled={isDownloading}>
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (icon ? null : <FileDown className="mr-2 h-4 w-4" />)}
                {isDownloading ? 'Generating...' : (icon ? 'Download' : 'Generate')}
            </Button>
        )}
    </div>
);

export default ReportsPage;