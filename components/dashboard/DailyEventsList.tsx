
import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../../lib/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import TaskEditDialog from './TaskEditDialog';

interface DailyEventsListProps {
    events: CalendarEvent[];
    selectedDate: Date;
    onSelectEvent: (event: CalendarEvent) => void;
    selectedEventId?: string | null;
}

const DailyEventsList: React.FC<DailyEventsListProps> = ({ events, selectedDate, onSelectEvent, selectedEventId }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [animatedEvents, setAnimatedEvents] = useState<Record<string, 'new' | 'updated'>>({});
    const prevEventsRef = useRef<CalendarEvent[]>();

    useEffect(() => {
        if (prevEventsRef.current) {
            const prevEvents = prevEventsRef.current;
            const animations: Record<string, 'new' | 'updated'> = {};

            events.forEach(currentEvent => {
                const prevEvent = prevEvents.find(pe => pe.id === currentEvent.id);
                if (!prevEvent) {
                    animations[currentEvent.id] = 'new';
                } else if (JSON.stringify(prevEvent) !== JSON.stringify(currentEvent)) {
                    animations[currentEvent.id] = 'updated';
                }
            });

            if (Object.keys(animations).length > 0) {
                setAnimatedEvents(animations);
                const timer = setTimeout(() => setAnimatedEvents({}), 1500); // Animation duration
                return () => clearTimeout(timer);
            }
        }

        prevEventsRef.current = events;
    }, [events]);

    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                    Tasks for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Task
                </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.length > 0 ? (
                    events.map(event => (
                        <div
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className={cn(
                                "p-3 rounded-lg cursor-pointer border flex justify-between items-center transition-colors",
                                selectedEventId === event.id ? "bg-accent" : "hover:bg-accent/50",
                                animatedEvents[event.id] === 'new' && 'animate-fade-in-down',
                                animatedEvents[event.id] === 'updated' && 'shimmer-bg animate-shimmer'
                            )}
                        >
                            <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.category}</p>
                            </div>
                            <Badge variant={event.status as any}>{event.status}</Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-4">No tasks for this day.</p>
                )}
            </div>
            <TaskEditDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialDate={selectedDate.toISOString().split('T')[0]}
            />
        </div>
    );
};

export default DailyEventsList;