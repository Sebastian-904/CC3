import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PlusCircle, FileText, Loader2, Trash2 } from 'lucide-react';
import ObligationDialog from '../components/obligations/ObligationDialog';
import { useLanguage } from '../hooks/useLanguage';
import type { Obligation } from '../lib/types';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const getDueDateRuleText = (obligation: Obligation) => {
    try {
        if (obligation.frequency === 'monthly') {
            const day = obligation.dayOfMonth === 'last' ? 'Last day' : `Day ${obligation.dayOfMonth}`;
            return `${day} of each month`;
        }
        if (obligation.frequency === 'yearly') {
            const monthName = new Date(2000, parseInt(obligation.month || '1') - 1, 1).toLocaleString('default', { month: 'long'});
            return `${monthName} ${obligation.dayOfMonth}`;
        }
        if (obligation.frequency === 'quarterly') {
            return `Quarterly`;
        }
    } catch (e) {
        // Fallback for any parsing errors
        return 'Rule defined';
    }
    return 'Rule defined';
  };

const ObligationsPage = () => {
    const { obligations, loading, activeCompany, deleteObligation } = useApp();
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [obligationToDelete, setObligationToDelete] = useState<Obligation | null>(null);
    
    const canManage = currentUser?.role === 'admin' || currentUser?.role === 'consultor';

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

    const handleDeleteClick = (obligation: Obligation) => {
        setObligationToDelete(obligation);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!obligationToDelete || !canManage) return;
        setIsDeleting(true);
        try {
            await deleteObligation(obligationToDelete.id);
            toast({
                title: "Obligation Deleted",
                description: `The obligation "${obligationToDelete.title}" has been deleted.`,
            });
            setIsConfirmOpen(false);
            setObligationToDelete(null);
        } catch (error) {
            console.error("Failed to delete obligation", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete the obligation.",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" /> {t('obligationsMatrix')}</h1>
                    <p className="text-muted-foreground">{t('trackObligations')}</p>
                </div>
                {canManage && (
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Obligation
                    </Button>
                )}
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
                                    {canManage && <th className="p-3 font-medium text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {obligations.length > 0 ? obligations.map(ob => (
                                    <tr key={ob.id} className="border-b last:border-b-0 hover:bg-accent/50">
                                        <td className="p-3 font-semibold">{ob.title}</td>
                                        <td className="hidden md:table-cell p-3">{ob.category}</td>
                                        <td className="hidden sm:table-cell p-3">{ob.frequency}</td>
                                        <td className="hidden lg:table-cell p-3">{getDueDateRuleText(ob)}</td>
                                        <td className="p-3"><Badge variant={ob.status === 'active' ? 'completed' : 'secondary'}>{ob.status}</Badge></td>
                                        {canManage && (
                                            <td className="p-3 text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(ob)} title="Delete Obligation">
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={canManage ? 6 : 5} className="p-6 text-center text-muted-foreground">No obligations found for this company.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <ObligationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
            
            {obligationToDelete && (
                <ConfirmationDialog
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Obligation"
                    description={`Are you sure you want to delete the obligation "${obligationToDelete.title}"? This will stop future tasks from being generated from this rule.`}
                    isConfirming={isDeleting}
                />
            )}
        </div>
    );
};

export default ObligationsPage;