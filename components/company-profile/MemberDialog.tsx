import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';
import { Trash2 } from 'lucide-react';

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const MemberDialog: React.FC<MemberDialogProps> = ({ isOpen, onClose, company }) => {
  // In a real app, you would have state management here to add/edit/delete members.
  // This is a simplified read-only view within a dialog structure.

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Members & Partners</DialogTitle>
            <DialogDescription>Add, edit, or remove members of {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <div className="space-y-2">
                {company.miembros.map(member => (
                    <div key={member.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                            <p className="font-medium">{member.nombre}</p>
                            <p className="text-sm text-muted-foreground">{member.rfc}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button className="mt-4 w-full">Add New Member</Button>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default MemberDialog;
