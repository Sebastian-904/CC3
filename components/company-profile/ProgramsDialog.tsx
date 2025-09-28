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
            <DialogTitle>Gestionar Programas y Certificaciones</DialogTitle>
            <DialogDescription>Actualizar información de programas para {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
            {company.programas.immex && (
                <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-1">IMMEX</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Número de Registro</label>
                            <Input defaultValue={company.programas.immex.numeroRegistro} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tipo</label>
                            <Input defaultValue={company.programas.immex.tipo} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Fecha de Autorización</label>
                            <Input type="date" defaultValue={company.programas.immex.fechaAutorizacion} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Fecha de Renovación</label>
                            <Input type="date" defaultValue={company.programas.immex.fechaRenovacion || ''} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mt-2 mb-1">Domicilios Autorizados</h4>
                        <div className="space-y-2">
                           {company.programas.immex.domiciliosAutorizados.map(d => (
                               <div key={d.id} className="text-xs p-2 border rounded-md bg-muted/50">{d.direccion}</div>
                           ))}
                        </div>
                    </div>
                </div>
            )}
             {company.programas.prosec && (
                 <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold border-b pb-1">PROSEC</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Número de Registro</label>
                            <Input defaultValue={company.programas.prosec.numeroRegistro} />
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Sector</label>
                            <Input defaultValue={company.programas.prosec.sector} />
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Fecha de Autorización</label>
                            <Input type="date" defaultValue={company.programas.prosec.fechaAutorizacion} />
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Fecha de Renovación</label>
                            <Input type="date" defaultValue={company.programas.prosec.fechaRenovacion || ''} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mt-2 mb-1">Domicilios Autorizados</h4>
                        <div className="space-y-2">
                           {company.programas.prosec.domiciliosAutorizados.map(d => (
                               <div key={d.id} className="text-xs p-2 border rounded-md bg-muted/50">{d.direccion}</div>
                           ))}
                        </div>
                    </div>
                 </div>
             )}
             {/* Add other programs here */}
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={onClose}>Guardar Cambios</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default ProgramsDialog;