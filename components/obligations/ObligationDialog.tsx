import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import Select from '../ui/Select';
import { Obligation, ObligationFrequency } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ObligationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    obligation?: Obligation;
}

const ObligationDialog: React.FC<ObligationDialogProps> = ({ isOpen, onClose, obligation }) => {
    const { addObligation, taskCategories } = useApp();
    const { toast } = useToast();

    const [title, setTitle] = useState(obligation?.title || '');
    const [description, setDescription] = useState(obligation?.description || '');
    const [category, setCategory] = useState(obligation?.category || taskCategories[0]?.id || '');
    const [frequency, setFrequency] = useState<ObligationFrequency>(obligation?.frequency || 'monthly');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        if (!title || !category) {
            toast({ variant: 'destructive', title: 'Missing fields' });
            return;
        }

        setIsSaving(true);
        try {
            await addObligation({ title, description, category, frequency });
            toast({ title: 'Obligation Saved', description: `"${title}" has been added.` });
            onClose();
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save obligation.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>{obligation ? 'Edit Obligation' : 'Add New Obligation'}</DialogTitle>
                <DialogDescription>Define a recurring compliance task for your company.</DialogDescription>
                <DialogClose onClose={onClose} />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="title">Title</label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                 <div className="space-y-1">
                    <label htmlFor="description">Description</label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label htmlFor="category">Category</label>
                        <Select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                            {taskCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <label htmlFor="frequency">Frequency</label>
                        <Select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as ObligationFrequency)}>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </Select>
                    </div>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Obligation
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ObligationDialog;
