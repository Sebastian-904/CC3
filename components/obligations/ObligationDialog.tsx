import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Obligation } from '../../lib/types';

interface ObligationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ObligationDialog: React.FC<ObligationDialogProps> = ({ isOpen, onClose }) => {
  const { addObligation, taskCategories, companyUsers } = useApp();
  const [formData, setFormData] = useState<Omit<Obligation, 'id' | 'companyId' | 'status'>>({
    title: '',
    category: taskCategories[0]?.id || '',
    frequency: 'monthly',
    dayOfMonth: '1',
    description: '',
    assigneeId: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addObligation(formData);
      setFormData({ title: '', category: taskCategories[0]?.id || '', frequency: 'monthly', dayOfMonth: '1', description: '', assigneeId: '' });
      onClose();
    } catch (error) {
      console.error('Failed to save obligation:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderDueDateRuleInput = () => {
      switch (formData.frequency) {
          case 'monthly':
              return (
                  <div>
                      <label htmlFor="dayOfMonth" className="text-sm font-medium">Día de Vencimiento</label>
                      <select id="dayOfMonth" name="dayOfMonth" value={formData.dayOfMonth} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>{day}</option>
                          ))}
                          <option value="last">Último día del mes</option>
                      </select>
                  </div>
              );
          case 'yearly':
               return (
                  <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label htmlFor="month" className="text-sm font-medium">Mes de Vencimiento</label>
                           <select id="month" name="month" value={formData.month} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</option>)}
                          </select>
                      </div>
                      <div>
                          <label htmlFor="dayOfMonth" className="text-sm font-medium">Día</label>
                           <select id="dayOfMonth" name="dayOfMonth" value={formData.dayOfMonth} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                      </div>
                  </div>
              );
          default:
              return null; // For quarterly, etc. we can add more specific inputs
      }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>New Obligation</DialogTitle>
            <DialogDescription>Define una regla para generar tareas de cumplimiento recurrentes.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4">
                <div>
                    <label htmlFor="title" className="text-sm font-medium">Título</label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1" placeholder="e.g., Declaración Mensual de IVA"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                           {taskCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="frequency" className="text-sm font-medium">Frecuencia</label>
                        <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                            <option value="monthly">Mensual</option>
                            <option value="quarterly">Trimestral</option>
                            <option value="yearly">Anual</option>
                        </select>
                    </div>
                 </div>
                 {renderDueDateRuleInput()}
                 <div>
                    <label htmlFor="assigneeId" className="text-sm font-medium">Asignado por defecto</label>
                    <select id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                        <option value="">Sin asignar</option>
                        {companyUsers.map(user => <option key={user.uid} value={user.uid}>{user.displayName}</option>)}
                    </select>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Añadir Obligación
                </Button>
            </DialogFooter>
        </form>
    </Dialog>
  );
};

export default ObligationDialog;