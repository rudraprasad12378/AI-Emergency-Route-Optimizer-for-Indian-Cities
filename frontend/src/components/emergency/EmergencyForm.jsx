import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const EmergencyForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    type: 'cardiac_arrest',
    severity: 'critical',
    callerName: '',
    callerPhone: '',
    patientCount: 1,
    description: '',
    pickupAddress: '',
    pickupLandmark: '',
    hospitalId: 'hosp-001',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.callerName || !formData.pickupAddress) return;

    onSubmit({
      ...formData,
      pickupLocation: {
        address: formData.pickupAddress,
        landmark: formData.pickupLandmark,
        coordinates: { lat: 20.2961 + (Math.random() - 0.5) * 0.05, lng: 85.8245 + (Math.random() - 0.5) * 0.05 },
      },
      destinationHospital: {
        id: formData.hospitalId,
        name: formData.hospitalId === 'hosp-001' ? 'AIIMS Bhubaneswar' : 'Capital Hospital',
        distanceKm: 8.4,
        estimatedTimeMin: 14,
      },
      assignedVehicleCallSign: 'AMB-103',
      etaMinutes: 7,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Emergency Type"
          required
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={[
            { label: 'Cardiac Arrest', value: 'cardiac_arrest' },
            { label: 'Building Fire / Smoke', value: 'building_fire' },
            { label: 'Severe Road Accident', value: 'road_accident' },
            { label: 'Maternity Emergency', value: 'maternity_emergency' },
            { label: 'Mass Casualty Incident', value: 'mass_casualty' },
          ]}
        />

        <Select
          label="Severity Priority"
          required
          value={formData.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
          options={[
            { label: 'Critical (Code Red)', value: 'critical' },
            { label: 'High (Code Amber)', value: 'high' },
            { label: 'Medium (Code Yellow)', value: 'medium' },
            { label: 'Low (Code Green)', value: 'low' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Caller Name"
          required
          placeholder="e.g. Ramesh Mohanty"
          value={formData.callerName}
          onChange={(e) => handleChange('callerName', e.target.value)}
        />

        <Input
          label="Caller Phone"
          required
          placeholder="+91 98765 43210"
          value={formData.callerPhone}
          onChange={(e) => handleChange('callerPhone', e.target.value)}
        />

        <Input
          label="Patient Count"
          type="number"
          min="1"
          value={formData.patientCount}
          onChange={(e) => handleChange('patientCount', parseInt(e.target.value, 10) || 1)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pickup Location / Street Address"
          required
          placeholder="e.g. Near Kalpana Square, Puri Cuttack Road"
          value={formData.pickupAddress}
          onChange={(e) => handleChange('pickupAddress', e.target.value)}
        />

        <Input
          label="Nearest Landmark"
          placeholder="e.g. Opposite State Museum"
          value={formData.pickupLandmark}
          onChange={(e) => handleChange('pickupLandmark', e.target.value)}
        />
      </div>

      <Select
        label="Destination Trauma Center / Hospital"
        required
        value={formData.hospitalId}
        onChange={(e) => handleChange('hospitalId', e.target.value)}
        options={[
          { label: 'AIIMS Bhubaneswar (Super Specialty Trauma)', value: 'hosp-001' },
          { label: 'Capital Hospital (City Civil Center)', value: 'hosp-002' },
          { label: 'Apollo Hospitals (Advanced Critical Care)', value: 'hosp-003' },
        ]}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Incident Notes & Triage Description
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe symptoms, scene conditions, hazmat or road blockages..."
          className="w-full rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-primary-500"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="danger" isLoading={isLoading}>
          Dispatch Emergency Unit Now
        </Button>
      </div>
    </form>
  );
};

export default EmergencyForm;
