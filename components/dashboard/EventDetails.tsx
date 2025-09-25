import React, { useState } from 'react';
import { CalendarEvent } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Calendar, Tag, AlertTriangle, FileText, X, User } from 'lucide-react';
import TaskEditDialog from './TaskEditDialog';

interface EventDetailsProps {
    event: CalendarEvent | null;
    clearSelection: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, clearSelection }) => {
    const { taskCategories, companyUsers } = useApp();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    if (!event) {
        return (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground p-6">
                    <Calendar className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-medium">Select an event</p>
                    <p className="text-sm">Choose an event from the list to see its details here.</p>
                </div>
            </Card>
        );
    }

    const category = taskCategories.find(c => c.id === event.category);
    const assignee = companyUsers.find(u => u.uid === event.assigneeId);

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    return (
        <>
            <Card className="h-full flex flex-col relative min-h-[400px]">
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7" onClick={clearSelection}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close details</span>
                </Button>
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                        Due on {new Date(event.dueDate).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={event.status as any}>{event.status}</Badge>
                        <Badge variant="secondary">{event.priority}</Badge>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                        <DetailRow icon={<Tag />} label="Category" value={category?.name || 'Uncategorized'} />
                        {assignee && <DetailRow icon={<User />} label="Assigned To" value={assignee.displayName} />}
                        <DetailRow icon={<AlertTriangle />} label="Priority" value={event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} />
                        <DetailRow icon={<FileText />} label="Description" value={event.description || 'No description provided.'} />
                    </div>
                    
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleEdit}>Edit Task</Button>
                </CardFooter>
            </Card>

            <TaskEditDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                event={event}
            />
        </>
    );
};

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-1">{React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}</div>
        <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    </div>
);

export default EventDetails;