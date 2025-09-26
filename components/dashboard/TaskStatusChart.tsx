import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { CalendarEvent } from '../../lib/types';
import { PieChart } from 'lucide-react';

interface TaskStatusChartProps {
    events: CalendarEvent[];
}

// This is a placeholder for a real chart component (e.g., from Recharts, Chart.js)
const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ events }) => {
    const data = useMemo(() => {
        const statuses = { pending: 0, completed: 0, overdue: 0 };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        events.forEach(event => {
            if (event.status === 'completed') {
                statuses.completed++;
            } else {
                const dueDate = new Date(event.dueDate);
                if (dueDate < today) {
                    statuses.overdue++;
                } else {
                    statuses.pending++;
                }
            }
        });
        const total = events.length || 1;
        return [
            { name: 'Completed', value: statuses.completed, color: 'bg-completed', percent: (statuses.completed / total * 100).toFixed(0) },
            { name: 'Pending', value: statuses.pending, color: 'bg-pending', percent: (statuses.pending / total * 100).toFixed(0) },
            { name: 'Overdue', value: statuses.overdue, color: 'bg-overdue', percent: (statuses.overdue / total * 100).toFixed(0) },
        ];
    }, [events]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> Task Status</CardTitle>
                <CardDescription>A summary of all task statuses.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-4 rounded-full flex overflow-hidden bg-muted">
                    {data.map(item => (
                        <div key={item.name} className={item.color} style={{ width: `${item.percent}%` }} title={`${item.name}: ${item.value}`}></div>
                    ))}
                </div>
                <div className="mt-4 flex justify-around text-sm">
                     {data.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                            <span>{item.name} ({item.value})</span>
                        </div>
                     ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskStatusChart;
