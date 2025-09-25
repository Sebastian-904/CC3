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
import { useLanguage } from '../hooks/useLanguage';
import AIProfileImporter from '../components/reports/AIProfileImporter';

const ReportsPage = () => {
    const { user } = useAuth();
    const { activeCompany, events, taskCategories, companyUsers } = useApp();
    const { t } = useLanguage();
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

        setReportTitle(`${t('reportMonthlySummary')} - ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
        setReportContent(
            <div className="space-y-8">
                <ReportKPIs events={monthEvents} />
                <div>
                    <h3 className="text-xl font-semibold mb-3">{t('reportDetailedList')}</h3>
                    <ReportTable events={monthEvents} />
                </div>
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

        setReportTitle(t('reportPendingByCategory'));
        setReportContent(
            <div className="space-y-8">
                {Object.entries(grouped).length > 0 ? Object.entries(grouped).map(([categoryName, categoryEvents]) => (
                    <div key={categoryName}>
                        <h3 className="text-xl font-semibold mb-3">{categoryName}</h3>
                        <ReportTable events={categoryEvents} />
                    </div>
                )) : <p className="text-center text-slate-500 py-8">{t('reportNoPendingTasks')}</p>}
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

        setReportTitle(`${t('reportDuesByDateRange')} ${dateRange.from} al ${dateRange.to}`);
        setReportContent(rangeEvents.length > 0 ? <ReportTable events={rangeEvents} /> : <p className="text-center text-slate-500 py-8">{t('reportNoDuesInRange')}</p>);
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
            "razonSocial", "rfc", "actividadEconomica", "telefono", "domicilioFiscal",
            "numeroEscrituraActa", "fechaActa", "nombreFedatarioActa",
            "numeroEscrituraPoder", "fechaPoder", "nombreFedatarioPoder",
            "immexNumero", "immexModalidad", "immexFecha", "prosecNumero", "prosecSector", "prosecFecha",
            "miembroNombre", "miembroRfc", "miembroTipo", "miembroCaracter", "miembroNacionalidad", "miembroTributaMexico",
            "domicilioDireccion", "domicilioTelefono", "domicilioPrograma",
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

    const ReportKPIs: React.FC<{events: CalendarEvent[]}> = ({ events }) => {
         const kpis = useMemo(() => {
            const counts = { total: events.length, completed: 0, pending: 0, overdue: 0 };
            events.forEach(event => {
                if (event.status === 'completed') counts.completed++;
                else if (event.status === 'pending') counts.pending++;
                else if (event.status === 'overdue') counts.overdue++;
            });
            return counts;
        }, [events]);
        const kpiItems = [
            { title: t('reportTotalTasks'), value: kpis.total },
            { title: t('reportCompleted'), value: kpis.completed },
            { title: t('reportPending'), value: kpis.pending },
            { title: t('reportOverdue'), value: kpis.overdue },
        ];
        return (
             <div className="grid grid-cols-4 gap-4 text-center border border-slate-200 rounded-lg p-4">
                {kpiItems.map(item => (
                    <div key={item.title} className="border-r border-slate-200 last:border-r-0">
                        <p className="text-3xl font-bold text-slate-800">{item.value}</p>
                        <p className="text-sm text-slate-500">{item.title}</p>
                    </div>
                ))}
            </div>
        )
    };

    const ReportTable: React.FC<{events: CalendarEvent[]}> = ({ events }) => (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="p-3 font-semibold text-xs uppercase tracking-wider text-slate-500">{t('reportDueDate')}</th>
                        <th className="p-3 font-semibold text-xs uppercase tracking-wider text-slate-500">{t('reportTitle')}</th>
                        <th className="p-3 font-semibold text-xs uppercase tracking-wider text-slate-500">{t('reportAssignedTo')}</th>
                        <th className="p-3 font-semibold text-xs uppercase tracking-wider text-slate-500">{t('reportStatus')}</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => {
                        const assignee = companyUsers.find(u => u.uid === event.assigneeId);
                        return (
                            <tr key={event.id} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50">
                                <td className="p-3">{event.dueDate}</td>
                                <td className="p-3 font-medium text-slate-700">{event.title}</td>
                                <td className="p-3 text-slate-500">{assignee?.displayName || 'N/A'}</td>
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
                    <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart2 className="h-6 w-6" /> {t('reportsAndData')}</h1>
                    <p className="text-muted-foreground">{t('manageReports')}</p>
                </div>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>AI-Powered Onboarding</CardTitle>
                        <CardDescription>Upload a company's document to automatically extract and populate their profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <AIProfileImporter />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>PDF Reports</CardTitle>
                        <CardDescription>Generate professional PDF reports for analysis and sharing.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ReportCard
                            title={t('reportMonthlySummary')}
                            description="A complete overview of the current month's performance and task status."
                            onClick={generateMonthlySummary}
                        />
                        <ReportCard
                            title={t('reportPendingByCategory')}
                            description="Identifies bottlenecks by grouping all pending tasks by category."
                            onClick={generatePendingByCategory}
                        />
                        <div className="bg-muted/50 p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <h4 className="font-semibold">{t('reportDuesByDateRange')}</h4>
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
                        <CardTitle>Data Templates (CSV)</CardTitle>
                        <CardDescription>Manage bulk data using CSV files for efficiency.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ReportCard
                            icon={<FileDown />}
                            title="Descargar Plantilla de Empresas"
                            description="Get the master CSV template to fill in and onboard a new client quickly."
                            onClick={handleDownloadTemplate}
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
    isDownloading?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, onClick, isDownloading = false }) => (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col justify-between">
        <div>
            <h4 className="font-semibold flex items-center gap-2">{icon || <FileText className="h-4 w-4 text-primary" />} {title}</h4>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
        </div>
        <Button onClick={onClick} className="w-full" disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (icon ? null : <FileDown className="mr-2 h-4 w-4" />)}
            {isDownloading ? 'Generating...' : (icon ? 'Download' : 'Generate')}
        </Button>
    </div>
);

export default ReportsPage;