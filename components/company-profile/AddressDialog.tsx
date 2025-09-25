import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Company } from '../../lib/types';

type Address = Company['domicilios'][0];

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSave: (addresses: Address[]) => void;
  isSaving: boolean;
}

const AddressDialog: React.FC<AddressDialogProps> = ({ isOpen, onClose, addresses, onSave, isSaving }) => {
    const [localAddresses, setLocalAddresses] = useState<Address[]>([]);

    useEffect(() => {
        if(isOpen) {
            setLocalAddresses(JSON.parse(JSON.stringify(addresses)));
        }
    }, [addresses, isOpen]);
    
    const handleChange = (index: number, field: keyof Address, value: string) => {
        const updated = [...localAddresses];
        (updated[index] as any)[field] = value;
        setLocalAddresses(updated);
    };

    const handleAdd = () => {
        setLocalAddresses([...localAddresses, { id: `new-${Date.now()}`, direccionCompleta: '', telefono: '', programaVinculado: '' }]);
    };

    const handleRemove = (index: number) => {
        setLocalAddresses(localAddresses.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localAddresses);
    };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Domicilios</DialogTitle>
            <DialogDescription>Añadir, editar o eliminar domicilios de operación.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                {localAddresses.map((address, index) => (
                    <div key={address.id} className="p-4 border rounded-lg space-y-3 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Textarea placeholder="Dirección Completa" value={address.direccionCompleta} onChange={e => handleChange(index, 'direccionCompleta', e.target.value)} required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Teléfono" value={address.telefono} onChange={e => handleChange(index, 'telefono', e.target.value)} />
                            <Input placeholder="Programa Vinculado" value={address.programaVinculado} onChange={e => handleChange(index, 'programaVinculado', e.target.value)} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAdd}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Añadir Domicilio
                </Button>
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

export default AddressDialog;