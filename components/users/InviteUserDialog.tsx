import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { UserRole } from '../../lib/types';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('cliente');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!email) return;
    setIsSending(true);
    // Simulate sending invitation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${email}.`
    });
    onClose();
    setEmail('');
    setRole('cliente');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>Send an invitation to a new user to join this company's workspace.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-4">
            <div>
                <label htmlFor="email-invite" className="text-sm font-medium">Email Address</label>
                <Input
                    id="email-invite"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                />
            </div>
             <div>
                <label htmlFor="role-invite" className="text-sm font-medium">Role</label>
                <select 
                    id="role-invite" 
                    value={role} 
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="mt-1 block w-full rounded-md border-input bg-background py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm h-10"
                >
                    <option value="cliente">Cliente</option>
                    <option value="consultor">Consultor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </DialogContent>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSend} disabled={isSending || !email}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Invitation
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default InviteUserDialog;
