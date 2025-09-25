import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import CalendarSection from '../components/dashboard/CalendarSection';
import DailyEventsList from '../components/dashboard/DailyEventsList';
import EventDetails from '../components/dashboard/EventDetails';
import { CalendarEvent } from '../lib/types';
import DashboardKPIs from '../components/dashboard/DashboardKPIs';
import Button from '../components/ui/Button';
import { Sparkles } from 'lucide-react';
import AIAssistantDialog from '../components/dashboard/AIAssistantDialog';

const DashboardPage = () => {
    const { activeCompany, events, loading } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);

    if (loading && !activeCompany) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (!activeCompany) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Please select a company to view the dashboard.</p>
            </div>
        );
    }

    const dailyEvents = events.filter(e => {
        const eventDate = new Date(e.dueDate);
        return eventDate.toDateString() === selectedDate.toDateString();
    });

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <Button onClick={() => setIsAssistantOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Assistant
                </Button>
            </div>

            <DashboardKPIs events={events} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <CalendarSection 
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        events={events}
                    />
                    <DailyEventsList 
                        events={dailyEvents}
                        selectedDate={selectedDate}
                        onSelectEvent={setSelectedEvent}
                        selectedEventId={selectedEvent?.id}
                    />
                </div>
                <div className="lg:col-span-1">
                    <EventDetails event={selectedEvent} clearSelection={() => setSelectedEvent(null)} />
                </div>
            </div>
            <AIAssistantDialog isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
        </div>
    );
};

export default DashboardPage;