import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';
import { Check, X } from 'lucide-react';

interface PadronesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const PadronesDialog: React.FC<PadronesDialogProps> = ({ isOpen, onClose, company }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Padrones</DialogTitle>
            <DialogDescription>Consultar los padrones de importadores para {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Padrón de Importadores General</h3>
                {company.padrones?.importadores ? (
                    <div className="flex items-center gap-2 mt-2 p-3 border rounded-md">
                        {company.padrones.importadores.activo ? <Check className="h-5 w-5 text-completed" /> : <X className="h-5 w-5 text-destructive" />}
                        <span className="font-medium">{company.padrones.importadores.activo ? 'Activo' : 'Inactivo'}</span>
                        <span className="text-muted-foreground ml-auto text-sm">Número: {company.padrones.importadores.numero}</span>
                    </div>
                ): (
                     <p className="text-sm text-muted-foreground text-center p-4">No hay información del padrón general.</p>
                )}
            </div>
             <div className="pt-4 border-t">
                 <h3 className="font-semibold">Padrones Sectoriales</h3>
                 <div className="space-y-2 mt-2">
                    {company.padrones?.sectoriales && company.padrones.sectoriales.length > 0 ? (
                        company.padrones.sectoriales.map(p => (
                            <div key={p.id} className="p-3 border rounded-md text-sm">
                                <p className="font-medium">{p.sector}</p>
                                <p className="text-xs text-muted-foreground">Fracción(es): {p.fraccion}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center p-4">No hay padrones sectoriales registrados.</p>
                    )}
                 </div>
             </div>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
            <Button onClick={onClose}>Guardar Cambios</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default PadronesDialog;