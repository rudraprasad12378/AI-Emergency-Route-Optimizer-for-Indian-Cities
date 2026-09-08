export function getBestRoute(routes) {
  return routes.reduce((best, r) => {
    if (!best || r.aiScore > best.aiScore) return r;
    return best;
  }, undefined);
}

export function getTimeSaved(current, alternative) {
  return Math.max(0, current.duration - alternative.duration);
}

export function getRouteColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}
