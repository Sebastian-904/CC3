

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
import { Label } from '../ui/Label';

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
}

const reminderOptions = [
    { value: '1d', label: '1 day before' },
    { value: '2d', label: '2 days before' },
    { value: '1w', label: '1 week before' },
];

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ isOpen, onClose, event }) => {
  const { addEvent, updateEvent, taskCategories, companyUsers } = useApp();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [category, setCategory] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDueDate(event.dueDate);
      setDescription(event.description);
      setPriority(event.priority);
      setCategory(event.category);
      setAssignedTo(event.assignedTo || '');
      setReminders(event.reminders || []);
    } else {
      // Defaults for new event
      setTitle('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPriority('medium');
      setCategory(taskCategories[0]?.id || '');
      setAssignedTo('');
      setReminders([]);
    }
  }, [event, taskCategories, isOpen]);

  const handleReminderChange = (value: string) => {
    setReminders(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };

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
                assignedTo: assignedTo || undefined,
                reminders,
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
                reminders,
                assignedTo: assignedTo || undefined,
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
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <Select id="priority" value={priority} onChange={e => setPriority(e.target.value as EventPriority)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                    {taskCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Select>
            </div>
        </div>
        <div className="space-y-1">
            <Label htmlFor="assignedTo">Assign to</Label>
            <Select id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                {companyUsers.map(user => (
                    <option key={user.uid} value={user.uid}>{user.displayName}</option>
                ))}
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Reminders</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                {reminderOptions.map(option => (
                <div key={option.value} className="flex items-center">
                    <input
                    type="checkbox"
                    id={`reminder-${option.value}`}
                    value={option.value}
                    checked={reminders.includes(option.value)}
                    onChange={() => handleReminderChange(option.value)}
                    className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary ring-offset-background"
                    />
                    <Label htmlFor={`reminder-${option.value}`} className="ml-2 font-normal">
                    {option.label}
                    </Label>
                </div>
                ))}
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
