import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Building, Clock, AlertTriangle, ListChecks } from 'lucide-react';
import { AggregatedCompanyData } from '../../lib/types';

interface OverallKPIsProps {
  aggregatedData: AggregatedCompanyData[];
}

const OverallKPIs: React.FC<OverallKPIsProps> = ({ aggregatedData }) => {
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalTasks = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    const totalCompanies = aggregatedData.length;

    aggregatedData.forEach(data => {
        data.events.forEach(event => {
            totalTasks++;
            if (event.status === 'completed') {
                // Not counted in pending/overdue
            } else {
                const dueDate = new Date(event.dueDate);
                if (dueDate < today) {
                    totalOverdue++;
                } else {
                    totalPending++;
                }
            }
        });
    });

    return { totalCompanies, totalTasks, totalPending, totalOverdue };
  }, [aggregatedData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Managed Companies</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalCompanies}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Tasks</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalPending + kpis.totalOverdue}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalPending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{kpis.totalOverdue}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallKPIs;
