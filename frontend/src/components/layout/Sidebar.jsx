import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Siren,
  AlertTriangle,
  Route,
  Truck,
  Building2,
  TrendingUp,
  Bell,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const Sidebar = ({ collapsed = false }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Control Center', path: '/', icon: LayoutDashboard },
    { label: 'Emergencies', path: '/emergencies', icon: Siren, badge: 3, badgeColor: 'bg-red-500' },
    { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { label: 'Active Routes', path: '/routes', icon: Route },
    { label: 'Fleet & Units', path: '/vehicles', icon: Truck },
    { label: 'Stations & Hubs', path: '/stations', icon: Building2 },
    { label: 'AI Predictions', path: '/predictions', icon: TrendingUp },
    { label: 'Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const adminItems = [
    { label: 'Admin Command', path: '/admin', icon: Shield },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`
        flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'} h-screen select-none z-30
      `}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-slate-800/80 gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-600 shadow-lg shadow-red-500/20">
          <Siren className="h-5 w-5 text-white animate-pulse" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight">
              AERO <span className="text-primary-400 font-normal text-xs">AI</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold truncate">
              Emergency Optimizer
            </p>
          </div>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Operations
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 group
                    ${isActive
                      ? 'bg-primary-600/15 text-primary-400 border border-primary-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${item.badgeColor || 'bg-primary-500'}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              System
            </p>
          )}
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 group
                    ${isActive
                      ? 'bg-primary-600/15 text-primary-400 border border-primary-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile footer */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
        <div className="flex items-center justify-between gap-2 rounded-xl p-2 bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Dispatcher'}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{user?.role || 'Operator'}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
