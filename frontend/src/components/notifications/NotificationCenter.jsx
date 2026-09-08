import React from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary-400" />
          <h3 className="text-sm font-bold text-white">Live Operations Dispatch Log</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2 py-0.5 text-[10px] font-bold">
              {unreadCount} Unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={markAllAsRead}>
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            Mark All Read
          </Button>
          <Button size="sm" variant="ghost" onClick={clearNotifications}>
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts logged"
          description="All routes and emergency dispatches are operating without critical disruptions."
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
