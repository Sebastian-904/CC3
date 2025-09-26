import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalendarEvent } from '../../lib/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { PlusCircle, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DailyEventsListProps {
    events: CalendarEvent[];
    selectedDate: Date;
    onSelectEvent: (event: CalendarEvent) => void;
    selectedEventId?: string | null;
    onNewTaskClick: () => void;
}

const DailyEventsList: React.FC<DailyEventsListProps> = ({ events, selectedDate, onSelectEvent, selectedEventId, onNewTaskClick }) => {
    const [animatedEvents, setAnimatedEvents] = useState<Record<string, 'new' | 'updated'>>({});
    const [view, setView] = useState<'day' | 'week'>('day');
    const prevEventsRef = useRef<CalendarEvent[]>();

    const filteredEvents = useMemo(() => {
        if (view === 'day') {
            return events
                .filter(event => new Date(event.dueDate).toDateString() === selectedDate.toDateString())
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        } else { // week view
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            
            return events
                .filter(event => {
                    const eventDate = new Date(event.dueDate);
                    return eventDate >= startOfWeek && eventDate <= endOfWeek;
                })
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        }
    }, [events, selectedDate, view]);

    useEffect(() => {
        if (prevEventsRef.current) {
            const prevEvents = prevEventsRef.current;
            const animations: Record<string, 'new' | 'updated'> = {};

            filteredEvents.forEach(currentEvent => {
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

        prevEventsRef.current = filteredEvents;
    }, [filteredEvents]);
    
    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
    };

    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex-1 min-w-0">
                     <h3 className="font-semibold truncate">
                        {view === 'day' 
                            ? `Tasks for ${selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}`
                            : `Tasks for the week of ${getWeekRange(selectedDate)}`}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                     <div className="flex items-center bg-muted p-1 rounded-md">
                        <Button size="sm" variant={view === 'day' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => setView('day')}><CalendarIcon className="h-4 w-4"/></Button>
                        <Button size="sm" variant={view === 'week' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => setView('week')}><CalendarDays className="h-4 w-4"/></Button>
                    </div>
                    <Button size="sm" onClick={onNewTaskClick}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Task
                    </Button>
                </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
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
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{event.title}</p>
                                {view === 'week' && <p className="text-xs text-muted-foreground">{new Date(event.dueDate).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</p>}
                            </div>
                            <Badge variant={event.status as any}>{event.status}</Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-4">No tasks for this {view}.</p>
                )}
            </div>
        </div>
    );
};

export default DailyEventsList;