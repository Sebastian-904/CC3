import React, { useState, useRef } from 'react';
import { CalendarEvent, ReminderTime, Attachment } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Calendar, User, Tag, Edit, Trash, XCircle, Clock, Share2, Bell, Paperclip, File as FileIcon, UploadCloud, X } from 'lucide-react';
import TaskEditDialog from './TaskEditDialog';
import ShareViaEmailDialog from '../ShareViaEmailDialog';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface EventDetailsProps {
    event: CalendarEvent | null;
    clearSelection: () => void;
}

const reminderLabels: Record<ReminderTime, string> = {
    '30m': '30 mins before',
    '1h': '1 hour before',
    '1d': '1 day before'
};

const EventDetails: React.FC<EventDetailsProps> = ({ event, clearSelection }) => {
    const { companyUsers, taskCategories, deleteEvent, updateEvent } = useApp();
    const { user: currentUser } = useAuth();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canManage = currentUser?.role === 'admin' || currentUser?.role === 'consultor';

    if (!event) {
        return (
            <Card className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground p-8">
                    <Calendar className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-medium">Select a Task</p>
                    <p className="text-sm">Click on a task from the list to see its details here.</p>
                </div>
            </Card>
        );
    }

    const handleAttachFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && event) {
            const newAttachment: Attachment = {
                id: uuidv4(),
                name: file.name,
                url: URL.createObjectURL(file), // Mock URL for display
                type: file.type,
            };

            const updatedAttachments = [...(event.attachments || []), newAttachment];
            try {
                await updateEvent({ ...event, attachments: updatedAttachments });
                toast({
                    title: "File Attached",
                    description: `${file.name} has been attached to the task.`,
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: "Could not attach the file. Please try again.",
                });
            }
             // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveAttachment = async (attachmentId: string) => {
        if (!event) return;
        const updatedAttachments = event.attachments?.filter(att => att.id !== attachmentId);
        try {
            await updateEvent({ ...event, attachments: updatedAttachments });
            toast({
                title: "File Removed",
                description: "The attachment has been removed from the task.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Removal Failed",
                description: "Could not remove the attachment. Please try again.",
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!event || !canManage) return;
        setIsDeleting(true);
        try {
            await deleteEvent(event.id);
            toast({
                title: "Task Deleted",
                description: `The task "${event.title}" has been successfully deleted.`,
            });
            clearSelection();
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Failed to delete event:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not delete the task. Please try again.",
            });
        } finally {
            setIsDeleting(false);
        }
    };
    
    const assignee = companyUsers.find(u => u.uid === event.assigneeId);
    const category = taskCategories.find(c => c.id === event.category);

    return (
        <>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex-1">
                        <CardTitle>{event.title}</CardTitle>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                             <Badge variant={event.status as any}>{event.status}</Badge>
                             <Badge variant="outline">{event.priority}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center -mr-2">
                        {canManage && (
                            <>
                                <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setIsShareOpen(true)} title="Share">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setIsEditDialogOpen(true)} title="Edit">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setIsConfirmOpen(true)} title="Delete">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={clearSelection} title="Close">
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 text-sm overflow-y-auto">
                    <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Due Date</p>
                            <p>{new Date(event.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                     {assignee && (
                        <div className="flex items-start gap-3">
                            <User className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Assigned To</p>
                                <p>{assignee.displayName}</p>
                            </div>
                        </div>
                    )}
                     {category && (
                        <div className="flex items-start gap-3">
                            <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Category</p>
                                <p>{category.name}</p>
                            </div>
                        </div>
                    )}

                    {event.reminders && event.reminders.length > 0 && (
                        <div className="flex items-start gap-3">
                            <Bell className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Reminders</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {event.reminders.map(r => (
                                        <Badge key={r.id} variant="secondary">{reminderLabels[r.time]}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {event.description && (
                         <div>
                            <p className="font-semibold mb-1">Description</p>
                            <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}

                    {/* Attachments Section */}
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <p className="font-semibold flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-muted-foreground" /> Archivos
                            </p>
                             {canManage && (
                                <Button variant="outline" size="sm" onClick={handleAttachFileClick}>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Adjuntar Archivo
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {event.attachments && event.attachments.length > 0 ? (
                                event.attachments.map(att => (
                                    <div key={att.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium truncate flex-1">
                                            <FileIcon className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{att.name}</span>
                                        </a>
                                        {canManage && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveAttachment(att.id)}>
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-center text-muted-foreground py-2">No files attached.</p>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>
             <TaskEditDialog 
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                event={event}
            />
            <ShareViaEmailDialog
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                documentTitle={`Task: ${event.title}`}
            />
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Task"
                description={`Are you sure you want to delete the task "${event.title}"? This action cannot be undone.`}
                isConfirming={isDeleting}
            />
        </>
    );
};

export default EventDetails;