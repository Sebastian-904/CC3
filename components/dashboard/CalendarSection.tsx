
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CalendarEvent, TaskCategory } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import Badge from '../ui/Badge';

interface CalendarSectionProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    events: CalendarEvent[];
    onSelectEvent: (event: CalendarEvent) => void;
}

interface PopoverState {
    day: Date;
    target: HTMLDivElement;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ selectedDate, setSelectedDate, events, onSelectEvent }) => {
    const { taskCategories } = useApp();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [animatedDates, setAnimatedDates] = useState<Set<string>>(new Set());
    const [popover, setPopover] = useState<PopoverState | null>(null);

    const prevEventsRef = useRef<CalendarEvent[]>();
    const calendarRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(popoverRef, () => {
        if(popover) setPopover(null);
    });

    useEffect(() => {
        if (prevEventsRef.current) {
            const prevEvents = prevEventsRef.current;
            const changedOrAddedEvents = events.filter(currentEvent => {
                const prevEvent = prevEvents.find(pe => pe.id === currentEvent.id);
                if (!prevEvent) return true;
                if (JSON.stringify(prevEvent) !== JSON.stringify(currentEvent)) return true;
                return false;
            });
            
            const newDates = new Set<string>();
            changedOrAddedEvents.forEach(e => newDates.add(new Date(e.dueDate).toDateString()));

            if (newDates.size > 0) {
                setAnimatedDates(newDates);
                const timer = setTimeout(() => setAnimatedDates(new Set()), 1000);
                return () => clearTimeout(timer);
            }
        }
        
        prevEventsRef.current = events;

    }, [events]);
    
    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach(event => {
            const dateStr = new Date(event.dueDate).toDateString();
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(event);
        });
        // Sort events within each day
        map.forEach((dayEvents) => dayEvents.sort((a,b) => a.title.localeCompare(b.title)));
        return map;
    }, [events]);

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = useMemo(() => {
        const dayArray = [];
        for (let i = 0; i < startingDay; i++) dayArray.push(null);
        for (let i = 1; i <= daysInMonth; i++) dayArray.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
        return dayArray;
    }, [currentMonth, startingDay, daysInMonth]);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDayClick = (day: Date, target: HTMLDivElement) => {
        setSelectedDate(day);
        const dayEvents = eventsByDate.get(day.toDateString()) || [];
        if (dayEvents.length > 0) {
            setPopover({ day, target });
        } else {
            setPopover(null);
        }
    };

    const getPopoverStyle = (): React.CSSProperties => {
        if (!popover || !calendarRef.current) return { display: 'none' };

        const calendarRect = calendarRef.current.getBoundingClientRect();
        const targetRect = popover.target.getBoundingClientRect();
        
        let top = targetRect.top - calendarRect.top + targetRect.height;
        let left = targetRect.left - calendarRect.left;

        // Basic boundary detection
        if (left + 240 > calendarRect.width) { // 240 is popover width
            left = targetRect.right - calendarRect.left - 240;
        }
        if (top + 200 > calendarRect.height) { // 200 is approx popover height
             top = targetRect.top - calendarRect.top - 200;
        }

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 50,
        };
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-card p-4 rounded-lg border relative" ref={calendarRef}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-accent"><ChevronLeft className="h-5 w-5" /></button>
                <h2 className="text-lg font-semibold">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-accent"><ChevronRight className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dayNames.map(day => (
                    <div key={day} className="text-center font-medium text-muted-foreground text-sm">{day}</div>
                ))}
                {days.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;

                    const dateStr = day.toDateString();
                    const isToday = dateStr === new Date().toDateString();
                    const isSelected = dateStr === selectedDate.toDateString();
                    const dayEvents = eventsByDate.get(dateStr) || [];
                    // FIX: Use a type predicate with filter to correctly type `categoryDots` as TaskCategory[].
                    const categoryDots = [...new Map(dayEvents.map(e => [e.category, taskCategories.find(c => c.id === e.category)])).values()].filter((c): c is TaskCategory => Boolean(c));
                    const shouldAnimate = animatedDates.has(dateStr);

                    return (
                        <div 
                            key={index} 
                            onClick={(e) => handleDayClick(day, e.currentTarget)} 
                            className={cn(
                                "flex flex-col items-center justify-start h-20 p-1 cursor-pointer rounded-lg hover:bg-accent transition-colors",
                                shouldAnimate && "animate-flash-bg"
                            )}
                        >
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full text-sm",
                                { 'bg-primary text-primary-foreground': isSelected },
                                { 'bg-accent text-accent-foreground': isToday && !isSelected }
                            )}>
                                {day.getDate()}
                            </span>
                             <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {categoryDots.slice(0, 3).map((category) => (
                                    <div key={category.id} className={cn("w-2 h-2 rounded-full", category.color)}></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {popover && (
                <div ref={popoverRef} style={getPopoverStyle()} className="w-60 bg-card rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="flex justify-between items-center p-2 border-b">
                        <h4 className="text-sm font-semibold">
                            {popover.day.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                        </h4>
                         <button onClick={() => setPopover(null)} className="p-1 rounded-full hover:bg-accent"><X className="h-4 w-4" /></button>
                    </div>
                    <ul className="p-1 max-h-48 overflow-y-auto">
                        {(eventsByDate.get(popover.day.toDateString()) || []).map(event => (
                            <li key={event.id}>
                                <button
                                    onClick={() => {
                                        onSelectEvent(event);
                                        setPopover(null);
                                    }}
                                    className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-accent text-sm"
                                >
                                    <Badge variant={event.status as any} className="w-16 justify-center">{event.status}</Badge>
                                    <span className="flex-1 truncate">{event.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CalendarSection;
