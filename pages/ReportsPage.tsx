import React, { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BarChart2, Calendar, Building, Loader2 } from 'lucide-react';
import ReportPreviewDialog from '../components/reports/ReportPreviewDialog';
import AIProfileImporter from '../components/reports/AIProfileImporter';

const ReportsPage: React.FC = () => {
    const { activeCompany, events, loading } = useApp();
    const [preview, setPreview] = useState<{ title: string; content: React.ReactNode } | null>(null);

    const taskSummaryContent = useMemo(() => {
        if (!events) return null;
        const total = events.length;
        const completed = events.filter(e => e.status === 'completed').length;
        const pending = events.filter(e => e.status === 'pending').length;
        const overdue = events.filter(e => e.status === 'overdue').length;
        return (
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <h2>Task Summary</h2>
                <ul>
                    <li>Total Tasks: {total}</li>
                    <li>Completed: {completed}</li>
                    <li>Pending: {pending}</li>
                    <li>Overdue: {overdue}</li>
                </ul>
                <h3>Upcoming Tasks (Next 30 days)</h3>
                <ul>
                    {events
                        .filter(e => new Date(e.dueDate) > new Date() && new Date(e.dueDate) < new Date(Date.now() + 30 * 86400000))
                        .map(e => <li key={e.id}>{e.title} - Due: {e.dueDate}</li>)
                    }
                </ul>
            </div>
        );
    }, [events]);

    const companyProfileContent = useMemo(() => {
        if (!activeCompany) return null;
        return (
             <div className="prose prose-sm dark:prose-invert max-w-none">
                <h2>Company Profile: {activeCompany.name}</h2>
                <p><strong>RFC:</strong> {activeCompany.general.datosFiscales.rfc}</p>
                <p><strong>Address:</strong> {activeCompany.general.datosFiscales.domicilioFiscal}</p>
                <h3>Programs</h3>
                <ul>
                    {activeCompany.programas.immex && <li>IMMEX: {activeCompany.programas.immex.numeroRegistro}</li>}
                    {activeCompany.programas.prosec && <li>PROSEC: {activeCompany.programas.prosec.numeroRegistro}</li>}
                </ul>
             </div>
        )
    }, [activeCompany]);


    const reportOptions = [
        { title: 'Task Summary Report', icon: Calendar, content: taskSummaryContent },
        { title: 'Company Profile Report', icon: Building, content: companyProfileContent },
    ];

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart2 className="h-6 w-6" /> Reports</h1>
                    <p className="text-muted-foreground">Generate and download compliance reports.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Generate Reports</CardTitle>
                        <CardDescription>Select a report to generate and preview.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportOptions.map((report) => (
                            <div key={report.title} className="p-4 border rounded-lg flex flex-col items-center text-center">
                                <report.icon className="h-10 w-10 text-primary mb-3" />
                                <h3 className="font-semibold">{report.title}</h3>
                                <Button className="mt-4 w-full" onClick={() => setPreview({ title: report.title, content: report.content })}>
                                    Generate & Preview
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <AIProfileImporter />

            </div>

            {preview && activeCompany && (
                <ReportPreviewDialog
                    isOpen={!!preview}
                    onClose={() => setPreview(null)}
                    title={preview.title}
                    companyName={activeCompany.name}
                >
                    {preview.content}
                </ReportPreviewDialog>
            )}
        </>
    );
};

export default ReportsPage;
