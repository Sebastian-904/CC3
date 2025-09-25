import React, { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import { CalendarEvent } from '../lib/types';
import DashboardKPIs from '../components/dashboard/DashboardKPIs';
import CalendarSection from '../components/dashboard/CalendarSection';
import DailyEventsList from '../components/dashboard/DailyEventsList';
import EventDetails from '../components/dashboard/EventDetails';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import { Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import AIAssistantDialog from '../components/dashboard/AIAssistantDialog';
import Button from '../components/ui/Button';
import AIHealthCheckDialog from '../components/dashboard/AIHealthCheckDialog';


const DashboardPage: React.FC = () => {
    const { events, loading } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);

    const filteredEvents = useMemo(() => {
        return events
            .filter(event => new Date(event.dueDate).toDateString() === selectedDate.toDateString())
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [events, selectedDate]);
    
    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsHealthCheckOpen(true)}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> AI Health
                        </Button>
                        <Button size="sm" onClick={() => setIsAIAssistantOpen(true)}>
                            <Sparkles className="mr-2 h-4 w-4" /> AI Assistant
                        </Button>
                    </div>
                </div>

                <DashboardKPIs events={events} />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <CalendarSection
                            selectedDate={selectedDate}
                            setSelectedDate={date => {
                                setSelectedDate(date);
                                setSelectedEvent(null);
                            }}
                            events={events}
                        />
                         <DailyEventsList
                            events={filteredEvents}
                            selectedDate={selectedDate}
                            onSelectEvent={handleSelectEvent}
                            selectedEventId={selectedEvent?.id}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <EventDetails event={selectedEvent} clearSelection={() => setSelectedEvent(null)} />
                    </div>
                </div>

                <TaskStatusChart events={events} />
            </div>
            <AIAssistantDialog isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />
            <AIHealthCheckDialog isOpen={isHealthCheckOpen} onClose={() => setIsHealthCheckOpen(false)} />
        </>
    );
};

export default DashboardPage;
