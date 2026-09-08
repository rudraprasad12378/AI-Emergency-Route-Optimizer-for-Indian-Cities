import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const IncidentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'waterlogging',
    severity: 'high',
    address: '',
    affectedLanes: 'Both lanes blocked',
    estimatedClearanceMinutes: 45,
    averageDelayMinutes: 15,
    recommendedAvoidanceRadiusMeters: 600,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.address) return;

    onSubmit({
      ...formData,
      location: {
        address: formData.address,
        coordinates: { lat: 20.2961 + (Math.random() - 0.5) * 0.04, lng: 85.8245 + (Math.random() - 0.5) * 0.04 },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Incident Title / Event Description"
        required
        placeholder="e.g. Flash flooding underpass obstruction"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Incident Hazard Type"
          required
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={[
            { label: 'Monsoon Waterlogging', value: 'waterlogging' },
            { label: 'VVIP Convoy Movement', value: 'vip_movement' },
            { label: 'Road Construction & Digging', value: 'construction' },
            { label: 'Religious Procession / Crowd', value: 'procession' },
            { label: 'Severe Multi-Vehicle Collision', value: 'collision' },
          ]}
        />

        <Select
          label="Traffic Impact Severity"
          required
          value={formData.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
          options={[
            { label: 'Critical Blockage', value: 'critical' },
            { label: 'High Congestion', value: 'high' },
            { label: 'Moderate Slowdown', value: 'medium' },
            { label: 'Low Impact', value: 'low' },
          ]}
        />
      </div>

      <Input
        label="Location / Junction Address"
        required
        placeholder="e.g. Nayapalli Flyover descending ramp"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Affected Lanes"
          value={formData.affectedLanes}
          onChange={(e) => handleChange('affectedLanes', e.target.value)}
        />

        <Input
          label="Est. Clearance (mins)"
          type="number"
          value={formData.estimatedClearanceMinutes}
          onChange={(e) => handleChange('estimatedClearanceMinutes', parseInt(e.target.value, 10) || 30)}
        />

        <Input
          label="Avoidance Radius (m)"
          type="number"
          value={formData.recommendedAvoidanceRadiusMeters}
          onChange={(e) => handleChange('recommendedAvoidanceRadiusMeters', parseInt(e.target.value, 10) || 500)}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="danger">
          Broadcast Hazard Alert
        </Button>
      </div>
    </form>
  );
};

export default IncidentForm;
