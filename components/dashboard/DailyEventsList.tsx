import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CalendarEvent, EventStatus } from '../../lib/types';
import { cn } from '../../lib/utils';
import EventDetails from './EventDetails';

interface DailyEventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

const statusColors: Record<EventStatus, string> = {
  pending: 'bg-pending',
  completed: 'bg-completed',
  overdue: 'bg-overdue',
};

const DailyEventsList: React.FC<DailyEventsListProps> = ({ selectedDate, events }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const dailyEvents = useMemo(() => {
    return events
      .filter(event => new Date(event.dueDate).toDateString() === selectedDate.toDateString())
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [events, selectedDate]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyEvents.length > 0 ? (
            <div className="space-y-3">
              {dailyEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", statusColors[event.status])} />
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks for this day.</p>
          )}
        </CardContent>
      </Card>
      {selectedEvent && <EventDetails event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </>
  );
};

export default DailyEventsList;
