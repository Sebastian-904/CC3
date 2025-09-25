import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { CalendarEvent } from '../../lib/types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskStatusChartProps {
    events: CalendarEvent[];
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ events }) => {

    const statusCounts = useMemo(() => {
        const counts = { completed: 0, pending: 0, overdue: 0, total: 0 };
        events.forEach(event => {
            if(event.status === 'completed') counts.completed++;
            else if(event.status === 'pending') counts.pending++;
            else if(event.status === 'overdue') counts.overdue++;
        });
        counts.total = counts.completed + counts.pending + counts.overdue;
        return counts;
    }, [events]);

    const chartData = [
        { status: 'Completed', count: statusCounts.completed, color: 'bg-completed', icon: <CheckCircle className="h-4 w-4 text-completed" /> },
        { status: 'Pending', count: statusCounts.pending, color: 'bg-pending', icon: <Clock className="h-4 w-4 text-pending" /> },
        { status: 'Overdue', count: statusCounts.overdue, color: 'bg-overdue', icon: <AlertCircle className="h-4 w-4 text-overdue" /> },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Task Status Overview</CardTitle>
                <CardDescription>A summary of all tasks by their current status.</CardDescription>
            </CardHeader>
            <CardContent>
                {statusCounts.total > 0 ? (
                    <div className="space-y-4">
                        <div className="flex w-full h-8 rounded-full overflow-hidden bg-muted">
                            {chartData.map(item => {
                                const percentage = (item.count / statusCounts.total) * 100;
                                if (percentage === 0) return null;
                                return (
                                    <div
                                        key={item.status}
                                        className={item.color}
                                        style={{ width: `${percentage}%` }}
                                        title={`${item.status}: ${item.count} (${percentage.toFixed(1)}%)`}
                                    />
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            {chartData.map(item => (
                                <div key={item.status} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-muted-foreground">{item.status}</span>
                                    <span className="font-semibold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-4">No task data to display.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default TaskStatusChart;
