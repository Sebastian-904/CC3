import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AggregatedCompanyData, TaskCategory } from '../../lib/types';
import { BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TasksByCategoryChartProps {
    aggregatedData: AggregatedCompanyData[];
    taskCategories: TaskCategory[];
}

const TasksByCategoryChart: React.FC<TasksByCategoryChartProps> = ({ aggregatedData, taskCategories }) => {
    const categoryMap = useMemo(() => new Map(taskCategories.map(c => [c.id, c.name])), [taskCategories]);

    const chartData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        
        aggregatedData.forEach(data => {
            data.events.forEach(event => {
                counts[event.category] = (counts[event.category] || 0) + 1;
            });
        });
        
        const sortedData = Object.entries(counts)
            .map(([categoryId, count]) => ({
                name: categoryMap.get(categoryId) || 'Unknown',
                count
            }))
            .sort((a, b) => b.count - a.count);
        
        const maxCount = Math.max(...sortedData.map(d => d.count), 0);

        return sortedData.map(item => ({
            ...item,
            width: maxCount > 0 ? (item.count / maxCount) * 100 : 0
        }));

    }, [aggregatedData, categoryMap]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Tasks by Category</CardTitle>
                <CardDescription>Distribution of all tasks across categories.</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="space-y-3">
                        {chartData.map((item, index) => (
                            <div key={item.name} className="grid grid-cols-4 items-center gap-2 text-sm">
                                <div className="col-span-1 truncate font-medium">{item.name}</div>
                                <div className="col-span-3 flex items-center gap-2">
                                    <div className="w-full bg-muted rounded-full h-4">
                                        <div 
                                            className="bg-primary h-4 rounded-full" 
                                            style={{ width: `${item.width}%` }}
                                            title={`${item.count} tasks`}
                                        />
                                    </div>
                                    <span className="font-semibold w-8 text-right">{item.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-center text-muted-foreground p-4">No task data available.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default TasksByCategoryChart;
