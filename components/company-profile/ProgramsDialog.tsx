import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2 } from 'lucide-react';
import { Company } from '../../lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import set from 'lodash.set';

type ProgramsData = Company['programas'];

interface ProgramsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProgramsData;
  onSave: (data: ProgramsData) => void;
  isSaving: boolean;
}

const ProgramsDialog: React.FC<ProgramsDialogProps> = ({ isOpen, onClose, data, onSave, isSaving }) => {
  const [formData, setFormData] = useState<ProgramsData>(data);
  
  useEffect(() => {
    if (isOpen) {
      // Ensure nested objects exist to prevent errors on controlled inputs
      const safeData = {
          immex: data.immex || { numeroRegistro: '', modalidad: '', fechaAutorizacion: '' },
          prosec: data.prosec || { numeroRegistro: '', sector: '', fechaAutorizacion: '' },
          certificacionIVAYIEPS: data.certificacionIVAYIEPS || { folio: '', rubro: '', resolucion: '', proximaRenovacion: ''},
          padronImportadores: data.padronImportadores || { folio: '', fechaRegistro: '', sector: ''}
      };
      setFormData(JSON.parse(JSON.stringify(safeData)));
    }
  }, [data, isOpen]);

  const handleChange = (path: string, value: string) => {
    const updatedData = { ...formData };
    set(updatedData, path, value);
    setFormData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Programas y Certificaciones</DialogTitle>
            <DialogDescription>Edita la información de los programas de fomento de la empresa.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="max-h-[70vh] overflow-y-auto">
                 <Tabs defaultValue="immex" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="immex">IMMEX</TabsTrigger>
                        <TabsTrigger value="prosec">PROSEC</TabsTrigger>
                        <TabsTrigger value="iva">IVA/IEPS</TabsTrigger>
                        <TabsTrigger value="padron">Padrón</TabsTrigger>
                    </TabsList>
                    <TabsContent value="immex" className="space-y-4 pt-4">
                        <Field label="No. de Registro" path="immex.numeroRegistro" value={formData.immex?.numeroRegistro} onChange={handleChange} />
                        <Field label="Modalidad" path="immex.modalidad" value={formData.immex?.modalidad} onChange={handleChange} />
                        <Field label="Fecha de Autorización" path="immex.fechaAutorizacion" value={formData.immex?.fechaAutorizacion} onChange={handleChange} type="date" />
                    </TabsContent>
                    <TabsContent value="prosec" className="space-y-4 pt-4">
                        <Field label="No. de Registro" path="prosec.numeroRegistro" value={formData.prosec?.numeroRegistro} onChange={handleChange} />
                        <Field label="Sector" path="prosec.sector" value={formData.prosec?.sector} onChange={handleChange} />
                        <Field label="Fecha de Autorización" path="prosec.fechaAutorizacion" value={formData.prosec?.fechaAutorizacion} onChange={handleChange} type="date" />
                    </TabsContent>
                 </Tabs>
            </DialogContent>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
            </DialogFooter>
        </form>
    </Dialog>
  );
};

const Field: React.FC<{label: string, path: string, value: string | undefined, onChange: (p: string, v: string) => void, type?: string}> = ({ label, path, value, onChange, type="text" }) => (
    <div>
        <label className="text-sm font-medium">{label}</label>
        <Input type={type} value={value || ''} onChange={e => onChange(path, e.target.value)} className="mt-1" />
    </div>
);

export default ProgramsDialog;