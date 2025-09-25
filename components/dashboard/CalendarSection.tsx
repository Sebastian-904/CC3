
import React, { useState, useMemo } from 'react';
import { CalendarEvent, TaskCategory } from '../../lib/types';
import { useApp } from '../../hooks/useApp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarSectionProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    events: CalendarEvent[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ selectedDate, setSelectedDate, events }) => {
    const { taskCategories } = useApp();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = useMemo(() => {
        const dayArray = [];
        for (let i = 0; i < startingDay; i++) {
            dayArray.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            dayArray.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
        }
        return dayArray;
    }, [currentMonth, startingDay, daysInMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const eventsByDate = useMemo(() => {
        const map = new Map<string, { category: TaskCategory, count: number }[]>();
        events.forEach(event => {
            const dateStr = new Date(event.dueDate).toDateString();
            const category = taskCategories.find(c => c.id === event.category);
            if (!category) return;

            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            
            const entries = map.get(dateStr)!;
            let entry = entries.find(e => e.category.id === category.id);
            if(entry) {
                entry.count++;
            } else {
                entries.push({category, count: 1});
            }
        });
        return map;
    }, [events, taskCategories]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-card p-4 rounded-lg border">
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

                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    const dayEvents = eventsByDate.get(day.toDateString()) || [];

                    return (
                        <div key={index} onClick={() => setSelectedDate(day)} className="flex flex-col items-center justify-start h-20 p-1 cursor-pointer rounded-lg hover:bg-accent transition-colors">
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full text-sm",
                                { 'bg-primary text-primary-foreground': isSelected },
                                { 'bg-accent text-accent-foreground': isToday && !isSelected }
                            )}>
                                {day.getDate()}
                            </span>
                             <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {dayEvents.slice(0, 3).map(({category}) => (
                                    <div key={category.id} className={cn("w-2 h-2 rounded-full", category.color)}></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarSection;
