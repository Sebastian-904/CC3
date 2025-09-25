
import React, { useState } from 'react';
import { CalendarEvent } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Calendar, User, Tag, Edit, Trash, XCircle, Clock, Share2 } from 'lucide-react';
import TaskEditDialog from './TaskEditDialog';
import ShareViaEmailDialog from '../ShareViaEmailDialog';

interface EventDetailsProps {
    event: CalendarEvent | null;
    clearSelection: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, clearSelection }) => {
    const { companyUsers, taskCategories } = useApp();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

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
    
    const assignee = companyUsers.find(u => u.uid === event.assigneeId);
    const category = taskCategories.find(c => c.id === event.category);

    return (
        <>
            <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{event.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                             <Badge variant={event.status as any}>{event.status}</Badge>
                             <Badge variant="outline">{event.priority}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center">
                         <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setIsShareOpen(true)}>
                            <Share2 className="h-5 w-5" />
                        </Button>
                         <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={clearSelection}>
                            <XCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 text-sm">
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
                                <div className="flex items-center gap-2">
                                     <img src={assignee.avatarUrl} alt={assignee.displayName} className="h-6 w-6 rounded-full" />
                                    <p>{assignee.displayName}</p>
                                </div>
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
                    
                    {event.description && (
                         <div>
                            <p className="font-semibold mb-1">Description</p>
                            <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" className="flex-1">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </CardFooter>
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
        </>
    );
};

export default EventDetails;
