import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import Select from '../ui/Select';
import { CalendarEvent, EventPriority, TaskCategory } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ isOpen, onClose, event }) => {
  const { addEvent, updateEvent, taskCategories } = useApp();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [category, setCategory] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDueDate(event.dueDate);
      setDescription(event.description);
      setPriority(event.priority);
      setCategory(event.category);
    } else {
      // Defaults for new event
      setTitle('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPriority('medium');
      setCategory(taskCategories[0]?.id || '');
    }
  }, [event, taskCategories, isOpen]);

  const handleSubmit = async () => {
    if (!title || !dueDate || !category) {
        toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all required fields." });
        return;
    }

    setIsSaving(true);
    try {
        if (event) {
            await updateEvent({
                ...event,
                title,
                dueDate,
                description,
                priority,
                category,
            });
            toast({ title: "Task Updated", description: `"${title}" has been updated.`});
        } else {
            await addEvent({
                title,
                dueDate,
                description,
                priority,
                category,
                status: 'pending',
                reminders: [],
            });
            toast({ title: "Task Created", description: `"${title}" has been added to the calendar.`});
        }
        onClose();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to save the task." });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{event ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogClose onClose={onClose} />
      </DialogHeader>
      <DialogContent className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title">Title</label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor="dueDate">Due Date</label>
          <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor="description">Description</label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label htmlFor="priority">Priority</label>
                <Select id="priority" value={priority} onChange={e => setPriority(e.target.value as EventPriority)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Select>
            </div>
            <div className="space-y-1">
                <label htmlFor="category">Category</label>
                <Select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                    {taskCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Select>
            </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Task'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TaskEditDialog;
