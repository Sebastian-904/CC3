import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Company } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface GeneralDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const GeneralDataDialog: React.FC<GeneralDataDialogProps> = ({ isOpen, onClose, company }) => {
    const { updateCompany } = useApp();
    const { toast } = useToast();
    const [formData, setFormData] = useState(company.general);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [field]: value,
            }
        }));
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCompany({ ...company, general: formData });
            toast({ title: "Success", description: "General data has been updated." });
            onClose();
        } catch {
            toast({ variant: 'destructive', title: "Error", description: "Failed to update data." });
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Edit General Data</DialogTitle>
            <DialogDescription>Update the main fiscal and legal information for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="font-semibold">Datos Fiscales</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label>Razón Social</label>
                    <Input name="datosFiscales.razonSocial" value={formData.datosFiscales.razonSocial} onChange={handleChange} />
                </div>
                 <div className="space-y-1">
                    <label>RFC</label>
                    <Input name="datosFiscales.rfc" value={formData.datosFiscales.rfc} onChange={handleChange} />
                </div>
                 <div className="space-y-1 col-span-2">
                    <label>Domicilio Fiscal</label>
                    <Input name="datosFiscales.domicilioFiscal" value={formData.datosFiscales.domicilioFiscal} onChange={handleChange} />
                </div>
                 <div className="space-y-1">
                    <label>Teléfono</label>
                    <Input name="datosFiscales.telefono" value={formData.datosFiscales.telefono} onChange={handleChange} />
                </div>
            </div>
             <h3 className="font-semibold pt-4 border-t">Acta Constitutiva</h3>
             {/* ... similar fields for actaConstitutiva and representanteLegal */}

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

export default GeneralDataDialog;
