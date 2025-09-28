import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Company } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface Anexo24DialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const Anexo24Dialog: React.FC<Anexo24DialogProps> = ({ isOpen, onClose, company }) => {
    const { updateCompany } = useApp();
    const { toast } = useToast();
    const [formData, setFormData] = useState(company.anexo24 || { empresa: '', linkAcceso: '', version: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(company.anexo24 || { empresa: '', linkAcceso: '', version: '' });
        }
    }, [company, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCompany({ ...company, anexo24: formData });
            toast({ title: "Éxito", description: "La información de Anexo 24 ha sido actualizada." });
            onClose();
        } catch {
            toast({ variant: 'destructive', title: "Error", description: "No se pudo actualizar la información." });
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Anexo 24</DialogTitle>
            <DialogDescription>Configurar los detalles del sistema Anexo 24 para {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-4">
             <div className="space-y-1">
                <label htmlFor="empresa">Empresa / Proveedor de Software</label>
                <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} />
            </div>
             <div className="space-y-1">
                <label htmlFor="linkAcceso">Link de Acceso</label>
                <Input id="linkAcceso" name="linkAcceso" value={formData.linkAcceso} onChange={handleChange} />
            </div>
             <div className="space-y-1">
                <label htmlFor="version">Versión del Sistema</label>
                <Input id="version" name="version" value={formData.version} onChange={handleChange} />
            </div>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
            </Button>
        </DialogFooter>
    </Dialog>
  );
};

export default Anexo24Dialog;