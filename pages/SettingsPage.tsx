import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { Upload, Trash2 } from 'lucide-react';

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

    const getInitials = (name: string = '') => {
        const parts = name.split(' ');
        if (parts.length === 0) return '?';
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
        return `${first}${last}`.toUpperCase();
    }

    const generateInitialAvatar = (initials: string) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="#4A5568"></rect><text x="50" y="55" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    const professionalAvatars = [
        generateInitialAvatar(getInitials(user?.displayName)),
        `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2D3748"/><path d="M0 0 L50 100 L100 0 Z" fill="#718096"/></svg>')}`,
        `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#E2E8F0"/><circle cx="50" cy="50" r="30" fill="#A0AEC0"/><circle cx="50" cy="50" r="15" fill="#4A5568"/></svg>')}`,
        `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#A0AEC0"/><rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" fill="#2D3748"/></svg>')}`
    ];
    
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || professionalAvatars[0]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your application settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1 mb-4 sm:mb-0">
                            <h4 className="font-medium">Theme</h4>
                            <p className="text-sm text-muted-foreground">Select the application's visual theme.</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-secondary p-1">
                            <Button 
                                variant={theme === 'light' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setTheme('light')}
                                className={cn({'bg-white text-black shadow-sm': theme === 'light'})}
                            >
                                Light
                            </Button>
                            <Button 
                                variant={theme === 'dark' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setTheme('dark')}
                                className={cn({'dark:bg-primary dark:text-primary-foreground': theme === 'dark'})}
                            >
                                Dark
                            </Button>
                            <Button 
                                variant={theme === 'system' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setTheme('system')}
                            >
                                System
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your avatar and profile image.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="col-span-1 flex flex-col items-center gap-4">
                            <img 
                                src={selectedAvatar} 
                                alt="Current Avatar" 
                                className="h-32 w-32 rounded-full object-cover border-4 border-primary/10"
                            />
                            <div className="flex items-center justify-center gap-2 w-full">
                                <Button as="label" variant="outline" className="flex-1 cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setSelectedAvatar(professionalAvatars[0])}
                                    aria-label="Remove photo"
                                >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-2">
                             <p className="text-sm font-medium text-muted-foreground mb-3">Or choose a professional avatar</p>
                             <div className="grid grid-cols-4 gap-4">
                                {professionalAvatars.map((avatarSrc, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedAvatar(avatarSrc)}
                                        className={cn('rounded-full aspect-square overflow-hidden focus:outline-none focus:ring-offset-2 transition-all', {
                                            'ring-2 ring-primary ring-offset-background': selectedAvatar === avatarSrc,
                                            'opacity-70 hover:opacity-100': selectedAvatar !== avatarSrc
                                        })}
                                    >
                                        <img src={avatarSrc} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="border-t pt-6">
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SettingsPage;