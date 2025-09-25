import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import ObligationsPage from './pages/ObligationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import AppLayout from './components/AppLayout';
import AuthGuard from './components/AuthGuard';
import ErrorBoundary from './components/ErrorBoundary';
import ImportReviewPage from './pages/ImportReviewPage';

const ProtectedLayout: React.FC = () => (
    <AuthGuard>
        <AppLayout>
            <Outlet />
        </AppLayout>
    </AuthGuard>
);

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/company-profile" element={<CompanyProfilePage />} />
                    <Route path="/obligations" element={<ObligationsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/import-review" element={<ImportReviewPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ErrorBoundary>
    );
};

export default App;