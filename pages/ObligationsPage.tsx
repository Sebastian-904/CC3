import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PlusCircle, FileText, Loader2 } from 'lucide-react';
import ObligationDialog from '../components/obligations/ObligationDialog';

const ObligationsPage = () => {
    const { obligations, loading, activeCompany } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (loading && !activeCompany) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    if (!activeCompany) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Company Selected</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Please select a company to view its obligations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" /> Obligations Matrix</h1>
                    <p className="text-muted-foreground">Track and manage all recurring compliance obligations.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Obligation
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Obligations</CardTitle>
                    <CardDescription>Obligations for {activeCompany.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 font-medium text-left">Title</th>
                                    <th className="hidden md:table-cell p-3 font-medium text-left">Category</th>
                                    <th className="hidden sm:table-cell p-3 font-medium text-left">Frequency</th>
                                    <th className="hidden lg:table-cell p-3 font-medium text-left">Due Date / Rule</th>
                                    <th className="p-3 font-medium text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {obligations.length > 0 ? obligations.map(ob => (
                                    <tr key={ob.id} className="border-b last:border-b-0 hover:bg-accent/50">
                                        <td className="p-3 font-semibold">{ob.title}</td>
                                        <td className="hidden md:table-cell p-3">{ob.category}</td>
                                        <td className="hidden sm:table-cell p-3">{ob.frequency}</td>
                                        <td className="hidden lg:table-cell p-3">{ob.dueDate}</td>
                                        <td className="p-3"><Badge variant={ob.status as any}>{ob.status}</Badge></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-muted-foreground">No obligations found for this company.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <ObligationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </div>
    );
};

export default ObligationsPage;
