import React, { useState, useRef, useMemo } from 'react';
import { Bell, CalendarClock, MessageSquare, AlertTriangle, UserCheck } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import Button from './ui/Button';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { cn } from '../lib/utils';
import { Notification } from '../lib/types';
import { useLanguage } from '../hooks/useLanguage';

// A simple time-ago function
const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};


const NotificationsMenu = () => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setIsOpen(false));
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'TASK_ASSIGNED': return <UserCheck className="h-5 w-5 text-blue-500" />;
            case 'TASK_DUE': return <CalendarClock className="h-5 w-5 text-yellow-500" />;
            case 'TASK_OVERDUE': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'COMMENT_MENTION': return <MessageSquare className="h-5 w-5 text-green-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsOpen(!isOpen)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-sm">
                    <Card className="shadow-lg animate-in fade-in-0 zoom-in-95">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
                            <CardTitle className="text-lg">{t('notifications')}</CardTitle>
                             {unreadCount > 0 && (
                                <Button variant="link" className="p-0 h-auto" onClick={() => markAllNotificationsAsRead()}>
                                    {t('markAllAsRead')}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0 max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div>
                                    {notifications.map(notification => (
                                        <div 
                                            key={notification.id}
                                            className="flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer"
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            {!notification.isRead && (
                                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" aria-label="Unread"></div>
                                            )}
                                            <div className={cn("flex-shrink-0", { 'ml-4': notification.isRead })}>{getNotificationIcon(notification.type)}</div>
                                            <div className="flex-1">
                                                <p className="text-sm">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{timeAgo(new Date(notification.timestamp))}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-muted-foreground p-8">{t('noNotifications')}</p>
                            )}
                        </CardContent>
                         {notifications.length > 0 && (
                             <CardFooter className="p-2 border-t">
                                 <Button variant="ghost" className="w-full text-sm">{t('viewAllNotifications')}</Button>
                             </CardFooter>
                         )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default NotificationsMenu;