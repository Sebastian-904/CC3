import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AggregatedCompanyData } from '../../lib/types';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import Badge from '../ui/Badge';

interface CompanyHealthTableProps {
    aggregatedData: AggregatedCompanyData[];
}

const CompanyHealthTable: React.FC<CompanyHealthTableProps> = ({ aggregatedData }) => {
    const { switchCompany } = useAuth();
    const navigate = useNavigate();

    const handleCompanySelect = (companyId: string) => {
        switchCompany(companyId);
        // After switching context, navigate to the client-specific dashboard.
        // The reload in switchCompany will ensure data is fresh.
        navigate('/dashboard');
    };

    const companyMetrics = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return aggregatedData.map(data => {
            let pending = 0;
            let overdue = 0;
            let completed = 0;
            
            data.events.forEach(event => {
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

            let health: 'good' | 'warning' | 'critical' = 'good';
            if (overdue > 2) health = 'critical';
            else if (overdue > 0) health = 'warning';
            
            return {
                id: data.company.id,
                name: data.company.name,
                pending,
                overdue,
                completed,
                health
            };
        }).sort((a,b) => b.overdue - a.overdue || b.pending - a.pending); // Sort by most critical
    }, [aggregatedData]);

    const healthIndicatorClasses: Record<string, string> = {
        good: 'bg-green-500',
        warning: 'bg-yellow-500',
        critical: 'bg-red-500',
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Companies Health Overview</CardTitle>
                <CardDescription>Click on a company to manage its details.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium">Health</th>
                                    <th className="text-left p-3 font-medium">Company</th>
                                    <th className="text-center p-3 font-medium">Overdue</th>
                                    <th className="text-center p-3 font-medium">Pending</th>
                                    <th className="text-center p-3 font-medium">Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyMetrics.map(metric => (
                                    <tr
                                        key={metric.id}
                                        className="border-b last:border-0 hover:bg-accent cursor-pointer"
                                        onClick={() => handleCompanySelect(metric.id)}
                                    >
                                        <td className="p-3">
                                            <div className="flex justify-center items-center">
                                                <div 
                                                    className={cn("h-2.5 w-2.5 rounded-full", healthIndicatorClasses[metric.health])} 
                                                    title={`Status: ${metric.health}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium truncate max-w-xs">{metric.name}</td>
                                        <td className="p-3 text-center">
                                            <Badge variant={metric.overdue > 0 ? 'overdue' : 'secondary'}>{metric.overdue}</Badge>
                                        </td>
                                        <td className="p-3 text-center">
                                            <Badge variant={metric.pending > 0 ? 'pending' : 'secondary'}>{metric.pending}</Badge>
                                        </td>
                                        <td className="p-3 text-center">
                                            <Badge variant="completed">{metric.completed}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {companyMetrics.length === 0 && (
                        <p className="text-center text-muted-foreground p-8">No companies found.</p>
                     )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyHealthTable;
