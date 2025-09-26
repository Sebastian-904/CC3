import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { GanttChartSquare, Loader2, User as UserIcon } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { getMockLoginUsers } from '../services/firebaseService';
import { UserProfile, UserRole } from '../lib/types';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
    const { user, login, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [loginUsers, setLoginUsers] = useState<UserProfile[]>([]);
    const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

    useEffect(() => {
        const users = getMockLoginUsers();
        setLoginUsers(users);
    }, []);

    const handleLogin = async (loginUser: UserProfile) => {
        setIsLoggingIn(loginUser.uid);
        try {
            await login(loginUser.email, 'password');
            toast({ title: t('loginSuccessTitle'), description: t('loginSuccessDesc') });
        } catch (err) {
            toast({ variant: "destructive", title: t('loginFailedTitle'), description: t('loginFailedDesc') });
            setIsLoggingIn(null);
        }
    };

    const tRole = (role: UserRole) => {
        const roles: Record<UserRole, string> = {
            admin: t('roleAdmin'),
            consultor: t('roleConsultant'),
            cliente: t('roleClient')
        };
        return roles[role];
    }

    if (authLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <GanttChartSquare className="h-8 w-8 text-primary" />
                        <CardTitle className="text-3xl font-bold">CompliancePro</CardTitle>
                    </div>
                    <CardDescription>{t('loginPageDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {loginUsers.map((profile) => (
                            <Card
                                key={profile.uid}
                                className={cn(
                                    "text-center p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-lg hover:border-primary",
                                    isLoggingIn === profile.uid && "ring-2 ring-primary"
                                )}
                                onClick={() => !isLoggingIn && handleLogin(profile)}
                            >
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
                                    {isLoggingIn === profile.uid ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    ) : (
                                        <UserIcon className="w-8 h-8 text-secondary-foreground" />
                                    )}
                                </div>
                                <p className="font-semibold text-sm">{profile.displayName}</p>
                                <p className="text-xs text-muted-foreground">{tRole(profile.role)}</p>
                            </Card>
                        ))}
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground mx-auto">{t('loginPageTitle')}</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;