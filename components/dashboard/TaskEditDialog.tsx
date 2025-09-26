import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '../ui/Dialog';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useApp } from '../../hooks/useApp';
import { CalendarEvent, EventPriority, EventStatus, Reminder, ReminderTime } from '../../lib/types';
import { Loader2, Sparkles, Bell, X, PlusCircle } from 'lucide-react';
import { getAIAssistantResponse } from '../../services/geminiService';
import Select from '../ui/Select';
import { v4 as uuidv4 } from 'uuid';
import Badge from '../ui/Badge';

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  initialDate?: string; // YYYY-MM-DD for new tasks
  initialData?: Partial<Omit<CalendarEvent, 'id' | 'companyId'>>;
}

interface AISuggestion {
    userId: string;
    reasoning: string;
}

const reminderOptions: { value: ReminderTime; label: string }[] = [
    { value: '30m', label: '30 minutes before' },
    { value: '1h', label: '1 hour before' },
    { value: '1d', label: '1 day before' },
];

const getReminderLabel = (time: ReminderTime) => {
    return reminderOptions.find(opt => opt.value === time)?.label || time;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ isOpen, onClose, event, initialDate, initialData }) => {
  const { addEvent, updateEvent, taskCategories, companyUsers } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    dueDate: initialDate || new Date().toISOString().split('T')[0],
    description: '',
    category: taskCategories[0]?.id || '',
    priority: 'medium' as EventPriority,
    status: 'pending' as EventStatus,
    assigneeId: '',
    reminders: [] as Reminder[],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [newReminder, setNewReminder] = useState<ReminderTime>('1d');

  useEffect(() => {
    if (isOpen) {
        if (event) {
            setFormData({
                title: event.title,
                dueDate: event.dueDate,
                description: event.description,
                category: event.category,
                priority: event.priority,
                status: event.status,
                assigneeId: event.assigneeId || '',
                reminders: event.reminders || [],
            });
        } else {
             setFormData({
                title: initialData?.title || '',
                dueDate: initialData?.dueDate || initialDate || new Date().toISOString().split('T')[0],
                description: initialData?.description || '',
                category: initialData?.category || taskCategories[0]?.id || '',
                priority: initialData?.priority || 'medium',
                status: initialData?.status || 'pending',
                assigneeId: initialData?.assigneeId || '',
                reminders: initialData?.reminders || [],
            });
        }
        // Reset suggestion state on open
        setAiSuggestion(null);
        setIsSuggesting(false);
    }
  }, [event, isOpen, initialDate, initialData, taskCategories]);

  const handleGetSuggestion = useCallback(async () => {
    if (!companyUsers || companyUsers.length === 0 || (!formData.title && !formData.description)) return;

    setIsSuggesting(true);
    setAiSuggestion(null);

    const userListString = companyUsers.map(u => `- User ID: ${u.uid}, Name: ${u.displayName}, Role: ${u.role}`).join('\n');
    const categoryName = taskCategories.find(c => c.id === formData.category)?.name || 'General';

    const customSystemInstruction = `You are an expert project manager. Your task is to suggest the best person to assign a task to from a given list of users. Analyze the task details provided in the user's prompt. Based on the task's content and the users' roles, suggest the most suitable user.
Respond ONLY with a JSON object in the following format: {"suggestedUserId": "user-id-of-the-person", "reasoning": "A brief explanation for your choice."}

Here is the list of available users:
${userListString}

Do not add any other text or formatting. Your entire response must be a single, valid JSON object.`;

    const prompt = `Task Title: "${formData.title}"\nTask Description: "${formData.description}"\nTask Category: "${categoryName}"`;

    try {
        const response = await getAIAssistantResponse(prompt, customSystemInstruction);
        const suggestion = JSON.parse(response);
        if (suggestion.suggestedUserId && suggestion.reasoning) {
            if (formData.assigneeId !== suggestion.suggestedUserId) {
                 setAiSuggestion({ userId: suggestion.suggestedUserId, reasoning: suggestion.reasoning });
            }
        }
    } catch (error) {
        console.error("Failed to get AI suggestion:", error);
    } finally {
        setIsSuggesting(false);
    }
  }, [formData.title, formData.description, formData.category, companyUsers, taskCategories, formData.assigneeId]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = setTimeout(() => {
        if (formData.title || formData.description) {
            handleGetSuggestion();
        }
    }, 1000); // 1-second debounce

    return () => {
        clearTimeout(handler);
    };
  }, [isOpen, formData.title, formData.description, handleGetSuggestion]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'assigneeId') {
      setAiSuggestion(null); // Clear suggestion on manual change
    }
  };

  const handleAddReminder = () => {
      if (newReminder && !formData.reminders.some(r => r.time === newReminder)) {
          setFormData(prev => ({
              ...prev,
              reminders: [...prev.reminders, { id: uuidv4(), time: newReminder }]
          }));
      }
  };

  const handleRemoveReminder = (id: string) => {
      setFormData(prev => ({
          ...prev,
          reminders: prev.reminders.filter(r => r.id !== id)
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    setIsSaving(true);
    try {
      if (event) {
        await updateEvent({ ...event, ...formData });
      } else {
        const { ...newEventData } = formData;
        await addEvent(newEventData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
            <DialogTitle>{event ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>Fill in the details for your compliance task.</DialogDescription>
            <DialogClose onClose={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
                <div>
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                        <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <label htmlFor="status" className="text-sm font-medium">Status</label>
                        <Select id="status" name="status" value={formData.status} onChange={handleChange} required className="mt-1">
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Select id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1">
                            {taskCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                        <Select id="priority" name="priority" value={formData.priority} onChange={handleChange} required className="mt-1">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="assigneeId" className="text-sm font-medium">Assign to</label>
                    {isSuggesting && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 mt-1 bg-secondary rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            AI is suggesting an assignee...
                        </div>
                    )}
                    {aiSuggestion && !isSuggesting && (
                        <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                            <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">AI Suggestion</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">{aiSuggestion.reasoning}</p>
                                    <Button 
                                        type="button" 
                                        variant="link" 
                                        className="p-0 h-auto mt-1 text-sm text-blue-600 dark:text-blue-400"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, assigneeId: aiSuggestion.userId }));
                                            setAiSuggestion(null);
                                        }}
                                    >
                                        Assign to {companyUsers.find(u => u.uid === aiSuggestion.userId)?.displayName}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <Select id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange} className="mt-1">
                        <option value="">Unassigned</option>
                        {companyUsers.map(user => <option key={user.uid} value={user.uid}>{user.displayName}</option>)}
                    </Select>
                </div>
                <div>
                    <label htmlFor="reminders" className="text-sm font-medium">Reminders</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Select id="reminders" value={newReminder} onChange={e => setNewReminder(e.target.value as ReminderTime)}>
                            {reminderOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                        <Button type="button" size="sm" variant="outline" onClick={handleAddReminder}>
                            <PlusCircle className="h-4 w-4 mr-2"/> Add
                        </Button>
                    </div>
                    {formData.reminders.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.reminders.map(reminder => (
                                <Badge key={reminder.id} variant="secondary" className="flex items-center gap-1.5 pr-1">
                                    <Bell className="h-3 w-3" />
                                    {getReminderLabel(reminder.time)}
                                    <button type="button" onClick={() => handleRemoveReminder(reminder.id)} className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1" placeholder="Add a short description..."/>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {event ? 'Save Changes' : 'Create Task'}
                </Button>
            </DialogFooter>
        </form>
    </Dialog>
  );
};

export default TaskEditDialog;