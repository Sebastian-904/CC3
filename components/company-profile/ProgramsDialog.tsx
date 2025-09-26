import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Company } from '../../lib/types';

interface ProgramsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const ProgramsDialog: React.FC<ProgramsDialogProps> = ({ isOpen, onClose, company }) => {
  // In a real app, you'd use useState and a save handler here.
  // This is a simplified version.
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Programs & Certifications</DialogTitle>
            <DialogDescription>Update program information for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-4">
            <div>
                <h3 className="font-semibold">IMMEX</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                        <label>Número de Registro</label>
                        <Input defaultValue={company.programas.immex?.numeroRegistro || ''} />
                    </div>
                     <div className="space-y-1">
                        <label>Tipo</label>
                        <Input defaultValue={company.programas.immex?.tipo || ''} />
                    </div>
                </div>
            </div>
             <div className="pt-4 border-t">
                <h3 className="font-semibold">PROSEC</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                        <label>Número de Registro</label>
                        <Input defaultValue={company.programas.prosec?.numeroRegistro || ''} />
                    </div>
                     <div className="space-y-1">
                        <label>Sector</label>
                        <Input defaultValue={company.programas.prosec?.sector || ''} />
                    </div>
                </div>
            </div>
             {/* Add other programs here */}
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default ProgramsDialog;
