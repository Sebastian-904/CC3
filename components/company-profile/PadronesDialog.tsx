import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';

interface PadronesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const PadronesDialog: React.FC<PadronesDialogProps> = ({ isOpen, onClose, company }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Padrones</DialogTitle>
            <DialogDescription>Manage importer/exporter registries for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <p>Importer and Sector-specific registries would be managed here.</p>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default PadronesDialog;
