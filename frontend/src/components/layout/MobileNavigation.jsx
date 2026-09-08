import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Siren, AlertTriangle, Route, Truck } from 'lucide-react';

export const MobileNavigation = () => {
  const items = [
    { label: 'Control', path: '/', icon: LayoutDashboard },
    { label: 'Emergencies', path: '/emergencies', icon: Siren },
    { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { label: 'Routes', path: '/routes', icon: Route },
    { label: 'Fleet', path: '/vehicles', icon: Truck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800/80 bg-slate-950/95 px-2 backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors
              ${isActive ? 'text-primary-400 font-bold' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;
