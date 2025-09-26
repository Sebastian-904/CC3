import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { GanttChartSquare, Loader2, User as UserIcon } from 'lucide-react';
import { MOCK_USERS } from '../services/firebaseService';
import { UserProfile } from '../lib/types';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (user: UserProfile) => {
        setError('');
        setLoading(true);
        try {
            // The password doesn't matter in the mock service
            await login(user.email, 'password');
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };
    
    const getRoleBadgeVariant = (role: UserProfile['role']) => {
        switch(role) {
            case 'admin': return 'destructive';
            case 'consultor': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center">
                       <GanttChartSquare className="h-10 w-10 text-primary" />
                       <span className="ml-3 text-3xl font-bold">CompliancePro</span>
                    </div>
                    <CardTitle className="text-2xl">Select a Profile</CardTitle>
                    <CardDescription>Click a profile to get instant access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-2 text-muted-foreground">Logging in...</p>
                        </div>
                    )}
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    
                    {!loading && MOCK_USERS.map((user) => (
                        <button
                            key={user.uid}
                            onClick={() => handleLogin(user)}
                            className="w-full text-left p-3 rounded-lg border flex items-center gap-4 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <UserIcon className="h-6 w-6 text-secondary-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{user.displayName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                             <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                        </button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;