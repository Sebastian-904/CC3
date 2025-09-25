import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Company } from '../../lib/types';

type Member = Company['miembros'][0];

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onSave: (members: Member[]) => void;
  isSaving: boolean;
}

const MemberDialog: React.FC<MemberDialogProps> = ({ isOpen, onClose, members, onSave, isSaving }) => {
  const [localMembers, setLocalMembers] = useState<Member[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      setLocalMembers(JSON.parse(JSON.stringify(members))); // Deep copy
    }
  }, [members, isOpen]);

  const handleMemberChange = (index: number, field: keyof Member, value: any) => {
    const updatedMembers = [...localMembers];
    (updatedMembers[index] as any)[field] = value;
    setLocalMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setLocalMembers([...localMembers, { id: `new-${Date.now()}`, nombre: '', rfc: '', tipoPersona: 'Física', caracter: '', nacionalidad: '', tributaEnMexico: true }]);
  };

  const handleRemoveMember = (index: number) => {
    setLocalMembers(localMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localMembers);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Miembros</DialogTitle>
            <DialogDescription>Añadir, editar o eliminar miembros de la sociedad.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                {localMembers.map((member, index) => (
                    <div key={member.id} className="p-4 border rounded-lg space-y-3 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveMember(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Nombre / Razón Social" value={member.nombre} onChange={e => handleMemberChange(index, 'nombre', e.target.value)} required />
                            <Input placeholder="RFC" value={member.rfc} onChange={e => handleMemberChange(index, 'rfc', e.target.value)} required />
                        </div>
                    </div>
                ))}
                 <Button type="button" variant="outline" className="w-full" onClick={handleAddMember}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Añadir Miembro
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

export default MemberDialog;