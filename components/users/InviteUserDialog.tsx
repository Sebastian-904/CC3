import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { UserRole } from '../../lib/types';
import { useToast } from '../../hooks/useToast';
import { Loader2, Send } from 'lucide-react';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ isOpen, onClose }) => {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('cliente');
    const [isSending, setIsSending] = useState(false);

    const handleInvite = async () => {
        if (!email) {
            toast({ variant: 'destructive', title: 'Email is required' });
            return;
        }
        setIsSending(true);
        // Simulate sending invitation
        await new Promise(res => setTimeout(res, 1000));
        setIsSending(false);
        toast({ title: 'Invitation Sent', description: `An invitation has been sent to ${email}.` });
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>Enter the user's email and assign a role to send an invitation.</DialogDescription>
                <DialogClose onClose={onClose} />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="email">Email Address</label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="new.user@example.com" />
                </div>
                <div className="space-y-1">
                    <label htmlFor="role">Role</label>
                    <Select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                        <option value="cliente">Client</option>
                        <option value="consultor">Consultor</option>
                        <option value="admin">Admin</option>
                    </Select>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleInvite} disabled={isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Invitation
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default InviteUserDialog;
