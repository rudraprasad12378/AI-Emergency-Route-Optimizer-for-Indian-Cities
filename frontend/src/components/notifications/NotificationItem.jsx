import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Zap, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';

export const NotificationItem = ({ notification, onMarkAsRead }) => {
  const icons = {
    critical: ShieldAlert,
    warning: AlertTriangle,
    success: Zap,
    info: Info,
  };

  const colors = {
    critical: 'text-red-400 bg-red-950/60 border-red-800/50',
    warning: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
    success: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
    info: 'text-sky-400 bg-sky-950/60 border-sky-800/50',
  };

  const Icon = icons[notification.type] || Info;

  return (
    <Card
      onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
      className={`
        cursor-pointer transition-all p-3.5
        ${!notification.read ? 'border-primary-500/60 bg-slate-900/90 shadow-md' : 'border-slate-800/80 bg-slate-950/40 opacity-75'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${colors[notification.type] || colors.info}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-100 truncate">{notification.title}</h4>
            <span className="text-[10px] font-mono text-slate-500 shrink-0">
              {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">{notification.message}</p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
