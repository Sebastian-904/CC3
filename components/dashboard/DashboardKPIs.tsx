
import React, { useMemo } from 'react';
import { CalendarEvent } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface DashboardKPIsProps {
    events: CalendarEvent[];
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ events }) => {

    const kpis = useMemo(() => {
        const counts = {
            total: events.length,
            completed: 0,
            pending: 0,
            overdue: 0,
        };
        
        events.forEach(event => {
            if (event.status === 'completed') {
                counts.completed++;
            } else if (event.status === 'pending') {
                counts.pending++;
            } else if (event.status === 'overdue') {
                counts.overdue++;
            }
        });
        
        return counts;
    }, [events]);

    const kpiItems: { title: string; value: number; icon: React.ReactNode, color: string }[] = [
        { title: 'Total Tasks', value: kpis.total, icon: <ListTodo className="h-5 w-5 text-muted-foreground" />, color: 'text-primary' },
        { title: 'Completed', value: kpis.completed, icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />, color: 'text-completed' },
        { title: 'Pending', value: kpis.pending, icon: <Clock className="h-5 w-5 text-muted-foreground" />, color: 'text-pending' },
        { title: 'Overdue', value: kpis.overdue, icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />, color: 'text-overdue' },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiItems.map(item => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        {item.icon}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DashboardKPIs;
