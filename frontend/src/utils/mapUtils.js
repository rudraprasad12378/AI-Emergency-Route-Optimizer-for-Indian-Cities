export const BHUBANESWAR_CENTER = { lat: 20.2961, lng: 85.8245 };
export const DEFAULT_ZOOM = 13;

export function calculateDistance(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDlat = Math.sin(dLat / 2);
  const sinDlng = Math.sin(dLng / 2);
  const calc = sinDlat * sinDlat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDlng * sinDlng;
  return R * 2 * Math.atan2(Math.sqrt(calc), Math.sqrt(1 - calc));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function interpolatePoint(a, b, t) {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function getPointAlongPath(waypoints, fraction) {
  if (waypoints.length < 2) return waypoints[0];
  if (fraction <= 0) return waypoints[0];
  if (fraction >= 1) return waypoints[waypoints.length - 1];

  const distances = [];
  let totalDist = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const d = calculateDistance(waypoints[i - 1], waypoints[i]);
    distances.push(d);
    totalDist += d;
  }

  const targetDist = totalDist * fraction;
  let accumulated = 0;
  for (let i = 0; i < distances.length; i++) {
    if (accumulated + distances[i] >= targetDist) {
      const segFraction = (targetDist - accumulated) / distances[i];
      return interpolatePoint(waypoints[i], waypoints[i + 1], segFraction);
    }
    accumulated += distances[i];
  }
  return waypoints[waypoints.length - 1];
}

export function getBearing(a, b) {
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(toRad(b.lat));
  const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
