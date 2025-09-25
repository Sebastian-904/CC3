import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Company } from '../../lib/types';

type Agent = Company['agentesAduanales'][0];

interface CustomsAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onSave: (agents: Agent[]) => void;
  isSaving: boolean;
}

const CustomsAgentDialog: React.FC<CustomsAgentDialogProps> = ({ isOpen, onClose, agents, onSave, isSaving }) => {
    const [localAgents, setLocalAgents] = useState<Agent[]>([]);
    
    useEffect(() => {
        if(isOpen) {
            setLocalAgents(JSON.parse(JSON.stringify(agents)));
        }
    }, [agents, isOpen]);

    const handleChange = (index: number, field: keyof Agent, value: string) => {
        const updated = [...localAgents];
        (updated[index] as any)[field] = value;
        setLocalAgents(updated);
    };

    const handleAdd = () => {
        setLocalAgents([...localAgents, { id: `new-${Date.now()}`, nombre: '', numeroPatente: '', estadoEncargo: 'Activo' }]);
    };

    const handleRemove = (index: number) => {
        setLocalAgents(localAgents.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localAgents);
    };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Gestionar Agentes Aduanales</DialogTitle>
            <DialogDescription>Añadir, editar o eliminar agentes aduanales.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4 max-h-[70vh] overflow-y-auto">
               {localAgents.map((agent, index) => (
                    <div key={agent.id} className="p-4 border rounded-lg space-y-3 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Input placeholder="Nombre del Agente o Agencia" value={agent.nombre} onChange={e => handleChange(index, 'nombre', e.target.value)} required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Número de Patente" value={agent.numeroPatente} onChange={e => handleChange(index, 'numeroPatente', e.target.value)} required />
                             <select value={agent.estadoEncargo} onChange={e => handleChange(index, 'estadoEncargo', e.target.value)} className="block w-full rounded-md border-input bg-background h-10 px-3">
                                <option value="Activo">Activo</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Revocado">Revocado</option>
                            </select>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAdd}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Añadir Agente Aduanal
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

export default CustomsAgentDialog;