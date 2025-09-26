import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';

interface Anexo24DialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const Anexo24Dialog: React.FC<Anexo24DialogProps> = ({ isOpen, onClose, company }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Anexo 24</DialogTitle>
            <DialogDescription>Manage Anexo 24 settings for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <p>Anexo 24 settings would be managed here.</p>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default Anexo24Dialog;
