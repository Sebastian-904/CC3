import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AggregatedCompanyData } from '../../lib/types';
import { Clock } from 'lucide-react';

interface RecentActivityFeedProps {
    aggregatedData: AggregatedCompanyData[];
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};


const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ aggregatedData }) => {
    
    const companyNameMap = useMemo(() => 
        new Map(aggregatedData.map(d => [d.company.id, d.company.name]))
    , [aggregatedData]);

    const recentActivities = useMemo(() => {
        return aggregatedData
            .flatMap(data => data.events)
            .filter(event => event.createdAt) // Ensure createdAt exists
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 7); // Get latest 7 activities
    }, [aggregatedData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Activity</CardTitle>
                <CardDescription>The latest tasks created across all companies.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivities.map(event => (
                            <div key={event.id} className="flex items-start gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        For <span className="font-semibold">{companyNameMap.get(event.companyId)}</span> - {timeAgo(new Date(event.createdAt!))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground p-4">No recent activity to show.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivityFeed;
