import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PlusCircle, Loader2, User as UserIcon } from 'lucide-react';
import InviteUserDialog from '../components/users/InviteUserDialog';

const UsersPage = () => {
    const { companyUsers, loading, activeCompany } = useApp();
    const { user: currentUser } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    const canManageUsers = currentUser?.role === 'admin' || currentUser?.role === 'consultor';

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p className="text-muted-foreground">Manage access for {activeCompany?.name}</p>
                    </div>
                    {canManageUsers && (
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    )}
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>The following users have access to this company's workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium text-left">User</th>
                                        <th className="hidden sm:table-cell p-3 font-medium text-left">Role</th>
                                        {canManageUsers && <th className="p-3 font-medium text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {companyUsers.map(user => (
                                        <tr key={user.uid} className="border-b last:border-b-0">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                                        <UserIcon className="h-5 w-5 text-secondary-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{user.displayName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell p-3">
                                                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                                            </td>
                                            {canManageUsers && (
                                                <td className="p-3 text-right">
                                                    {user.uid !== currentUser?.uid && (
                                                        <Button variant="outline" size="sm">Manage</Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <InviteUserDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </>
    );
};

export default UsersPage;