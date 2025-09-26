import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ListChecks, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { CalendarEvent } from '../../lib/types';

interface DashboardKPIsProps {
  events: CalendarEvent[];
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ events }) => {
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTasks = events.length;
    let pending = 0;
    let completed = 0;
    let overdue = 0;

    events.forEach(event => {
      if (event.status === 'completed') {
        completed++;
      } else {
        const dueDate = new Date(event.dueDate);
        if (dueDate < today) {
          overdue++;
        } else {
          pending++;
        }
      }
    });

    return { totalTasks, pending, completed, overdue };
  }, [events]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{kpis.overdue}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-completed">{kpis.completed}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKPIs;
