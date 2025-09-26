import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CalendarEvent } from '../../lib/types';
import Button from '../ui/Button';

interface CalendarSectionProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: CalendarEvent[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ selectedDate, setSelectedDate, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const eventDays = useMemo(() => {
    const dates = new Set<string>();
    events.forEach(event => {
        dates.add(new Date(event.dueDate).toDateString());
    });
    return dates;
  }, [events]);

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    return [...blanks, ...days].map((day, index) => {
      if (!day) return <div key={`blank-${index}`} className="p-1 text-center"></div>;

      const date = new Date(year, month, day);
      const hasEvent = eventDays.has(date.toDateString());

      return (
        <div key={day} className="p-1 text-center">
          <button
            onClick={() => setSelectedDate(date)}
            className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors',
              isSameDay(date, new Date()) && 'text-primary',
              isSameDay(date, selectedDate) && 'bg-primary text-primary-foreground',
              !isSameDay(date, selectedDate) && 'hover:bg-accent',
            )}
          >
            {day}
          </button>
           {hasEvent && <div className="mx-auto mt-1 h-1 w-1 rounded-full bg-pending"></div>}
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <CardTitle className="text-lg">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-y-1 mt-2">
            {renderCalendar()}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
