import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/Dialog';
import { CalendarEvent } from '../../lib/types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit } from 'lucide-react';
import TaskEditDialog from './TaskEditDialog';

interface EventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

const EventDetails: React.FC<EventDetailsProps> = ({ isOpen, onClose, event }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClose = () => {
      setIsEditing(false);
      onClose(); // Close the details view as well after editing
  }

  return (
    <>
        <Dialog isOpen={isOpen && !isEditing} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
                <DialogDescription>
                    Due on {new Date(event.dueDate).toLocaleDateString()}
                </DialogDescription>
                <DialogClose onClose={onClose} />
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="text-sm font-semibold">Status:</span>
                        <Badge variant={event.status} className="ml-2">{event.status}</Badge>
                    </div>
                     <div>
                        <span className="text-sm font-semibold">Priority:</span>
                         <Badge variant="secondary" className="ml-2 capitalize">{event.priority}</Badge>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Description</h4>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{event.description || "No description provided."}</p>
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Close</Button>
                <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
            </DialogFooter>
        </Dialog>
        {isEditing && (
            <TaskEditDialog
                isOpen={isEditing}
                onClose={handleEditClose}
                event={event}
            />
        )}
    </>
  );
};

export default EventDetails;
