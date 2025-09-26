import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';
import { Trash2 } from 'lucide-react';

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const AddressDialog: React.FC<AddressDialogProps> = ({ isOpen, onClose, company }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Registered Addresses</DialogTitle>
            <DialogDescription>Add, edit, or remove facility addresses for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <div className="space-y-2">
                {company.domicilios.map(address => (
                    <div key={address.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                            <p className="font-medium">{address.direccionCompleta}</p>
                            <p className="text-sm text-muted-foreground">{address.telefono}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button className="mt-4 w-full">Add New Address</Button>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default AddressDialog;
