import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import { Company } from '../../lib/types';
import { Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';

interface CustomsAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const CustomsAgentDialog: React.FC<CustomsAgentDialogProps> = ({ isOpen, onClose, company }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>Manage Customs Agents</DialogTitle>
            <DialogDescription>Manage customs agents for {company.name}.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <DialogContent>
            <div className="space-y-2">
                {company.agentesAduanales.map(agent => (
                    <div key={agent.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                            <p className="font-medium">{agent.nombre}</p>
                            <p className="text-sm text-muted-foreground">Patente: {agent.numeroPatente}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={agent.estadoEncargo === 'Activo' ? 'completed' : 'pending'}>{agent.estadoEncargo}</Badge>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button className="mt-4 w-full">Add New Agent</Button>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
    </Dialog>
  );
};

export default CustomsAgentDialog;
