import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { UserProfile } from '../lib/types';

const SettingsPage = () => {
    const { user, updateUserProfile, loading: authLoading } = useAuth();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { toast } = useToast();

    const [profile, setProfile] = useState<Partial<UserProfile>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                displayName: user.displayName,
                email: user.email,
                emailPreferences: user.emailPreferences,
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleEmailPrefChange = (pref: keyof UserProfile['emailPreferences'], value: boolean) => {
        setProfile(p => ({
            ...p,
            emailPreferences: { ...p.emailPreferences!, [pref]: value },
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile(profile);
            toast({ title: "Success", description: "Your profile has been updated." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || !user) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{t('settings')}</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('myProfile')}</CardTitle>
                    <CardDescription>{t('updateProfileInfo')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-1">
                        <label htmlFor="displayName" className="text-sm font-medium">{t('displayName')}</label>
                        <Input id="displayName" name="displayName" value={profile.displayName || ''} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium">{t('emailAddress')}</label>
                        <Input id="email" name="email" value={profile.email || ''} disabled />
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('saveChanges')}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('emailNotifications')}</CardTitle>
                    <CardDescription>{t('manageEmailNotifications')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">{t('taskAssigned')}</p>
                            <p className="text-sm text-muted-foreground">{t('taskAssignedDesc')}</p>
                        </div>
                        <Switch checked={profile.emailPreferences?.taskAssigned || false} onCheckedChange={checked => handleEmailPrefChange('taskAssigned', checked)} />
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">{t('taskDue')}</p>
                            <p className="text-sm text-muted-foreground">{t('taskDueDesc')}</p>
                        </div>
                        <Switch checked={profile.emailPreferences?.taskDue || false} onCheckedChange={checked => handleEmailPrefChange('taskDue', checked)} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('displayPreferences')}</CardTitle>
                    <CardDescription>{t('customizeAppearance')}</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="language" className="text-sm font-medium">{t('language')}</label>
                        <select id="language" value={language} onChange={e => setLanguage(e.target.value as 'en' | 'es')} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="theme" className="text-sm font-medium">{t('theme')}</label>
                        <select id="theme" value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'system')} className="mt-1 block w-full rounded-md border-input bg-background h-10 px-3">
                            <option value="light">{t('light')}</option>
                            <option value="dark">{t('dark')}</option>
                            <option value="system">{t('system')}</option>
                        </select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
