import React from 'react';
import { Circle, Popup } from 'react-leaflet';

export const TrafficLayer = ({ sensors = [], riskZones = [] }) => {
  return (
    <>
      {/* Risk and Waterlogging Hazard Zones */}
      {riskZones.map((zone) => (
        <Circle
          key={zone.id}
          center={zone.center}
          radius={zone.radiusMeters}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '4, 6',
          }}
        >
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-red-600 block">{zone.name}</strong>
              <p className="text-slate-600 mt-0.5">{zone.cause}</p>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* Traffic Sensors */}
      {sensors.map((sensor) => {
        const color =
          sensor.congestionLevel >= 80
            ? '#ef4444'
            : sensor.congestionLevel >= 50
            ? '#f59e0b'
            : '#10b981';

        return (
          <Circle
            key={sensor.id}
            center={[sensor.lat, sensor.lng]}
            radius={250}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.35,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="p-1 text-xs">
                <strong className="block">{sensor.name}</strong>
                <p className="text-slate-600">Congestion: {sensor.congestionLevel}%</p>
                <p className="text-slate-600">Avg Speed: {sensor.avgSpeedKmph} km/h</p>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
};

export default TrafficLayer;
