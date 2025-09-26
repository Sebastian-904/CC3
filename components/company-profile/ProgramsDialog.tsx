import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Company } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ProgramsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const ProgramsDialog: React.FC<ProgramsDialogProps> = ({ isOpen, onClose, company }) => {
    const { updateCompany } = useApp();
    const { toast } = useToast();
    const [formData, setFormData] = useState(company.programas);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [program, field] = name.split('.');
         setFormData(prev => ({
            ...prev,
            [program]: {
                ...(prev as any)[program],
                [field]: value,
            }
        }));
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCompany({ ...company, programas: formData });
            toast({ title: "Success", description: "Programs have been updated." });
            onClose();
        } catch {
             toast({ variant: 'destructive', title: "Error", description: "Failed to update programs." });
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Edit Programs</DialogTitle>
            <DialogDescription>Update IMMEX, PROSEC, and other program details for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-6">
            <div>
                <h3 className="font-semibold">IMMEX</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input name="immex.numeroRegistro" placeholder="Número de Registro" value={formData.immex?.numeroRegistro || ''} onChange={handleChange} />
                    <Input name="immex.modalidad" placeholder="Modalidad" value={formData.immex?.modalidad || ''} onChange={handleChange} />
                    <Input name="immex.fechaAutorizacion" placeholder="Fecha Autorización" type="date" value={formData.immex?.fechaAutorizacion || ''} onChange={handleChange} />
                </div>
            </div>
             <div className="pt-6 border-t">
                <h3 className="font-semibold">PROSEC</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input name="prosec.numeroRegistro" placeholder="Número de Registro" value={formData.prosec?.numeroRegistro || ''} onChange={handleChange} />
                    <Input name="prosec.sector" placeholder="Sector" value={formData.prosec?.sector || ''} onChange={handleChange} />
                    <Input name="prosec.fechaAutorizacion" placeholder="Fecha Autorización" type="date" value={formData.prosec?.fechaAutorizacion || ''} onChange={handleChange} />
                </div>
            </div>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default ProgramsDialog;
