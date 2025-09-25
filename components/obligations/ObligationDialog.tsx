
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Loader2 } from 'lucide-react';

interface ObligationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ObligationDialog: React.FC<ObligationDialogProps> = ({ isOpen, onClose }) => {
  // const { addObligation } = useApp(); // NOTE: addObligation not implemented in AppContext
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    frequency: 'monthly',
    dueDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // await addObligation(formData);
      console.log('Adding obligation:', formData);
      // Reset form and close
      setFormData({ title: '', category: '', frequency: 'monthly', dueDate: '' });
      onClose();
    } catch (error) {
      console.error('Failed to save obligation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>New Obligation</DialogTitle>
            <DialogDescription>Add a new recurring compliance obligation to the matrix.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4">
                <div>
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1" placeholder="e.g., Declaración Mensual de IVA"/>
                </div>
                 <div>
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1" placeholder="e.g., Fiscal"/>
                </div>
                <div>
                    <label htmlFor="frequency" className="text-sm font-medium">Frequency</label>
                    <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} className="mt-1 block w-full rounded-md border-input bg-background py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date / Rule</label>
                    <Input id="dueDate" name="dueDate" placeholder="e.g., '17th of each month'" value={formData.dueDate} onChange={handleChange} required className="mt-1" />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Obligation
                </Button>
            </DialogFooter>
        </form>
    </Dialog>
  );
};

export default ObligationDialog;
