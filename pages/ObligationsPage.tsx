import React, { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle, Trash2, FileText, Loader2 } from 'lucide-react';
import { Obligation } from '../lib/types';
import Badge from '../components/ui/Badge';
import ObligationDialog from '../components/obligations/ObligationDialog';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useToast } from '../hooks/useToast';

const ObligationsPage: React.FC = () => {
    const { obligations, taskCategories, deleteObligation: deleteObligationFromContext, loading } = useApp();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [obligationToDelete, setObligationToDelete] = useState<Obligation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const canManage = user?.role === 'admin' || user?.role === 'consultor';

    const categoryMap = useMemo(() => 
        new Map(taskCategories.map(c => [c.id, c.name]))
    , [taskCategories]);

    const handleDelete = async () => {
        if (!obligationToDelete) return;
        setIsDeleting(true);
        try {
            await deleteObligationFromContext(obligationToDelete.id);
            toast({ title: "Obligation Deleted", description: `"${obligationToDelete.title}" has been removed.` });
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete obligation." });
        } finally {
            setIsDeleting(false);
            setObligationToDelete(null);
        }
    };
    
    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" /> Obligations Matrix</h1>
                        <CardDescription>Manage recurring compliance obligations.</CardDescription>
                    </div>
                     {canManage && (
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Obligation
                        </Button>
                    )}
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Obligations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium">Title</th>
                                        <th className="text-left p-3 font-medium">Category</th>
                                        <th className="text-left p-3 font-medium">Frequency</th>
                                        <th className="text-left p-3 font-medium">Status</th>
                                        {canManage && <th className="p-3"></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {obligations.map((ob, index) => (
                                        <tr key={ob.id} className="border-b last:border-0">
                                            <td className="p-3 font-medium">{ob.title}</td>
                                            <td className="p-3 text-muted-foreground">{categoryMap.get(ob.category) || ob.category}</td>
                                            <td className="p-3 text-muted-foreground capitalize">{ob.frequency}</td>
                                            <td className="p-3">
                                                <Badge variant={ob.status === 'active' ? 'completed' : 'secondary'}>{ob.status}</Badge>
                                            </td>
                                            {canManage && (
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => setObligationToDelete(ob)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {obligations.length === 0 && (
                                <p className="text-center text-muted-foreground p-8">No obligations have been set up.</p>
                             )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <ObligationDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

            {obligationToDelete && (
                 <ConfirmationDialog
                    isOpen={!!obligationToDelete}
                    onClose={() => setObligationToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Obligation"
                    description={`Are you sure you want to delete the obligation "${obligationToDelete.title}"? This cannot be undone.`}
                    isConfirming={isDeleting}
                />
            )}
        </>
    );
};

export default ObligationsPage;
