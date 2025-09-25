import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2 } from 'lucide-react';
import { Company } from '../../lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import set from 'lodash.set';

type GeneralData = Company['general'];

interface GeneralDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: GeneralData;
  onSave: (data: GeneralData) => void;
  isSaving: boolean;
}

const GeneralDataDialog: React.FC<GeneralDataDialogProps> = ({ isOpen, onClose, data, onSave, isSaving }) => {
  const [formData, setFormData] = useState<GeneralData>(data);
  
  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(data))); // Deep copy
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
            <DialogTitle>Gestionar Información General</DialogTitle>
            <DialogDescription>Edita la información fundamental de la empresa.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent>
                <Tabs defaultValue="fiscal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="fiscal">Datos Fiscales</TabsTrigger>
                        <TabsTrigger value="acta">Acta Constitutiva</TabsTrigger>
                        <TabsTrigger value="rep">Rep. Legal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fiscal" className="space-y-4 pt-4">
                        <Field label="Razón Social" path="datosFiscales.razonSocial" value={formData.datosFiscales.razonSocial} onChange={handleChange} />
                        <Field label="RFC" path="datosFiscales.rfc" value={formData.datosFiscales.rfc} onChange={handleChange} />
                        <Field label="Teléfono" path="datosFiscales.telefono" value={formData.datosFiscales.telefono} onChange={handleChange} />
                        <Field label="Domicilio Fiscal" path="datosFiscales.domicilioFiscal" value={formData.datosFiscales.domicilioFiscal} onChange={handleChange} />
                    </TabsContent>
                    <TabsContent value="acta" className="space-y-4 pt-4">
                        <Field label="No. de Escritura" path="actaConstitutiva.numeroEscritura" value={formData.actaConstitutiva.numeroEscritura} onChange={handleChange} />
                        <Field label="Fecha" path="actaConstitutiva.fecha" value={formData.actaConstitutiva.fecha} onChange={handleChange} type="date" />
                        <Field label="Nombre Fedatario" path="actaConstitutiva.nombreFedatario" value={formData.actaConstitutiva.nombreFedatario} onChange={handleChange} />
                    </TabsContent>
                    <TabsContent value="rep" className="space-y-4 pt-4">
                        <Field label="No. Escritura Poder" path="representanteLegal.numeroEscrituraPoder" value={formData.representanteLegal.numeroEscrituraPoder} onChange={handleChange} />
                        <Field label="Fecha Poder" path="representanteLegal.fechaPoder" value={formData.representanteLegal.fechaPoder} onChange={handleChange} type="date" />
                        <Field label="Nombre Fedatario" path="representanteLegal.nombreFedatario" value={formData.representanteLegal.nombreFedatario} onChange={handleChange} />
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

const Field: React.FC<{label: string, path: string, value: string, onChange: (p: string, v: string) => void, type?: string}> = ({ label, path, value, onChange, type="text" }) => (
    <div>
        <label className="text-sm font-medium">{label}</label>
        <Input type={type} value={value || ''} onChange={e => onChange(path, e.target.value)} className="mt-1" />
    </div>
);

export default GeneralDataDialog;