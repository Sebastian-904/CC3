import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CalendarEvent, EventStatus } from '../../lib/types';
import { cn } from '../../lib/utils';
import EventDetails from './EventDetails';
import { useApp } from '../../hooks/useApp';

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
  const { companyUsers, taskCategories } = useApp();

  const userMap = useMemo(() => 
    new Map(companyUsers.map(u => [u.uid, u.displayName]))
  , [companyUsers]);

  const categoryMap = useMemo(() =>
    new Map(taskCategories.map(c => [c.id, c.name]))
  , [taskCategories]);

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
              {dailyEvents.map(event => {
                const assignedUser = event.assignedTo ? userMap.get(event.assignedTo) : null;
                const userInitial = assignedUser?.charAt(0).toUpperCase() || '?';
                return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", statusColors[event.status])} />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{categoryMap.get(event.category) || event.category}</p>
                      </div>
                      <div 
                        className="h-6 w-6 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-xs font-semibold text-secondary-foreground"
                        title={assignedUser || 'Unassigned'}
                      >
                        {userInitial}
                      </div>
                    </div>
                );
            })}
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
