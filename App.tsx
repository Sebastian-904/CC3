

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/AppLayout';
import AuthGuard from './components/AuthGuard';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import SettingsPage from './pages/SettingsPage';
import ObligationsPage from './pages/ObligationsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import ComplianceLibraryPage from './pages/ComplianceLibraryPage';
import ImportReviewPage from './pages/ImportReviewPage';
import QuickStartGuidePage from './pages/QuickStartGuidePage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/*"
                    element={
                        <AuthGuard>
                            <AppLayout>
                                <Routes>
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/company-profile" element={<CompanyProfilePage />} />
                                    <Route path="/obligations" element={<ObligationsPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/import-review" element={<ImportReviewPage />} />
                                    <Route path="/users" element={<UsersPage />} />
                                    <Route path="/library" element={<ComplianceLibraryPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="/quick-start" element={<QuickStartGuidePage />} />
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </AppLayout>
                        </AuthGuard>
                    }
                />
            </Routes>
        </ErrorBoundary>
    );
};

export default App;