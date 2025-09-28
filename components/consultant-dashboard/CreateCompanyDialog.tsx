import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { createCompany } from '../../services/firebaseService';
import { useAuth } from '../../hooks/useAuth';

interface CreateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompanyDialog: React.FC<CreateCompanyDialogProps> = ({ isOpen, onClose }) => {
    const { toast } = useToast();
    const { switchCompany } = useAuth();
    const [name, setName] = useState('');
    const [rfc, setRfc] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!name || !rfc) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please provide a name and RFC for the new company.' });
            return;
        }
        setIsCreating(true);
        try {
            const newCompany = await createCompany({ name, rfc });
            toast({ title: 'Company Created', description: `Successfully created ${newCompany.name}. Now switching to new company.` });
            
            // Close dialog before switching to avoid UI lag
            handleClose();

            // Delay switch slightly to allow toast to be seen before layout remount
            setTimeout(() => {
                switchCompany(newCompany.id); 
            }, 500);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Creation Failed', description: 'Could not create the new company.' });
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        if (isCreating) return;
        setName('');
        setRfc('');
        onClose();
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose}>
            <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                    Set up a new company profile from scratch.
                </DialogDescription>
                <DialogClose onClose={handleClose} />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">Company Name (Razón Social)</label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="New Company S.A. de C.V." />
                </div>
                <div className="space-y-1">
                    <label htmlFor="rfc" className="text-sm font-medium">RFC</label>
                    <Input id="rfc" value={rfc} onChange={e => setRfc(e.target.value)} placeholder="NCO010101XYZ" />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate} disabled={isCreating || !name || !rfc}>
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Create Company
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CreateCompanyDialog;
