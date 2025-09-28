import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllCompaniesData } from '../services/firebaseService';
import { AggregatedCompanyData, TaskCategory } from '../lib/types';
import { Globe, Loader2 } from 'lucide-react';
import OverallKPIs from '../components/consultant-dashboard/OverallKPIs';
import CompanyHealthTable from '../components/consultant-dashboard/CompanyHealthTable';
import TasksByCategoryChart from '../components/consultant-dashboard/TasksByCategoryChart';
import RecentActivityFeed from '../components/consultant-dashboard/RecentActivityFeed';
import { useApp } from '../hooks/useApp';

const ConsultantDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { taskCategories } = useApp(); // Reuse task categories from app context
    const [aggregatedData, setAggregatedData] = useState<AggregatedCompanyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.role === 'admin' || user?.role === 'consultor') {
                try {
                    const data = await getAllCompaniesData();
                    setAggregatedData(data);
                } catch (error) {
                    console.error("Failed to fetch aggregated data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);
    
    // Redirect if a client user somehow lands here
    if (!loading && user?.role === 'cliente') {
        return <Navigate to="/dashboard" replace />;
    }

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-6 w-6" /> Global Dashboard</h1>
                <p className="text-muted-foreground">An overview of all managed companies.</p>
            </div>

            <OverallKPIs aggregatedData={aggregatedData} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <CompanyHealthTable aggregatedData={aggregatedData} />
                </div>
                <div className="space-y-6">
                    <TasksByCategoryChart aggregatedData={aggregatedData} taskCategories={taskCategories} />
                    <RecentActivityFeed aggregatedData={aggregatedData} />
                </div>
            </div>

        </div>
    );
};

export default ConsultantDashboardPage;
