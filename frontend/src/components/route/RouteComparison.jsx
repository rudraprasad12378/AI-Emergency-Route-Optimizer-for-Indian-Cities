import React from 'react';
import { RouteCard } from './RouteCard';

export const RouteComparison = ({ routes = [], selectedRouteId, onSelectRoute }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Available Multi-Route Options ({routes.length})
      </h4>
      <div className="space-y-2.5">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={route.id === selectedRouteId}
            onSelect={onSelectRoute}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteComparison;
