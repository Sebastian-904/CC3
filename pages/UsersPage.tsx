import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Users, PlusCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '../lib/types';
import Badge from '../components/ui/Badge';
import InviteUserDialog from '../components/users/InviteUserDialog';

const UsersPage: React.FC = () => {
    const { companyUsers, loading } = useApp();
    const { user } = useAuth();
    const [isInviteOpen, setInviteOpen] = useState(false);

    const canManage = user?.role === 'admin' || user?.role === 'consultor';

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6" /> User Management</h1>
                        <p className="text-muted-foreground">View and manage users in your organization.</p>
                    </div>
                     {canManage && (
                        <Button onClick={() => setInviteOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Company Users</CardTitle>
                        <CardDescription>
                            A list of all users in the organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                             <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium">Name</th>
                                        <th className="text-left p-3 font-medium">Email</th>
                                        <th className="text-left p-3 font-medium">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companyUsers.map((u) => (
                                        <tr key={u.uid} className="border-b last:border-0">
                                            <td className="p-3 font-medium">{u.displayName}</td>
                                            <td className="p-3 text-muted-foreground">{u.email}</td>
                                            <td className="p-3"><Badge variant="secondary" className="capitalize">{u.role}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <InviteUserDialog isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
        </>
    );
};

export default UsersPage;
