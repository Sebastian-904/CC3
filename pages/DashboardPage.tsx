import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import DashboardKPIs from '../components/dashboard/DashboardKPIs';
import CalendarSection from '../components/dashboard/CalendarSection';
import DailyEventsList from '../components/dashboard/DailyEventsList';
import ComplianceNewsFeed from '../components/dashboard/ComplianceNewsFeed';
import AIAssistantDialog from '../components/dashboard/AIAssistantDialog';
import Button from '../components/ui/Button';
import { Sparkles, CalendarPlus } from 'lucide-react';
import TaskEditDialog from '../components/dashboard/TaskEditDialog';
import { CalendarEvent } from '../lib/types';
import { useToast } from '../hooks/useToast';

const DashboardPage: React.FC = () => {
    const { events, addEvent, taskCategories } = useApp();
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

    const handleCreateTaskFromNews = async (task: { title: string; description: string }) => {
        try {
            const newTask: Omit<CalendarEvent, 'id' | 'companyId'> = {
                title: task.title,
                description: task.description,
                dueDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                priority: 'medium',
                category: taskCategories[0]?.id || 'cat-1',
                reminders: [],
            };
            await addEvent(newTask);
            toast({
                title: 'Task Created',
                description: `Task "${task.title}" has been added to your calendar.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create task.',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(true)}>
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                    <Button onClick={() => setIsAiAssistantOpen(true)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Assistant
                    </Button>
                </div>
            </div>

            <DashboardKPIs events={events} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CalendarSection selectedDate={selectedDate} setSelectedDate={setSelectedDate} events={events} />
                </div>
                <div>
                    <DailyEventsList selectedDate={selectedDate} events={events} />
                </div>
            </div>

            <ComplianceNewsFeed onCreateTask={handleCreateTaskFromNews} />

            <AIAssistantDialog isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} />
            
            {isNewTaskDialogOpen && (
                <TaskEditDialog
                    isOpen={isNewTaskDialogOpen}
                    onClose={() => setIsNewTaskDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardPage;
