import React from 'react';
import type { SpecialtyMode } from '../types/hospital.types.ts';

interface EmergencyStatusPillProps {
  readonly specialtyMode: SpecialtyMode;
  readonly specialtyName: string;
  readonly emergencySpecialtyVerified: boolean;
  readonly className?: string;
}

export const EmergencyStatusPill: React.FC<EmergencyStatusPillProps> = ({
  specialtyMode,
  specialtyName,
  emergencySpecialtyVerified,
  className = ''
}) => {
  if (specialtyMode === 'EMERGENCY_AND_OPD' && emergencySpecialtyVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 ${className}`}
      >
        <span className="font-bold">✓</span>
        <span>24x7 {specialtyName} Emergency</span>
      </span>
    );
  }

  if (specialtyMode === 'OPD_ONLY') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-800 border border-amber-500/30 ${className}`}
      >
        <span className="font-bold">⚠️</span>
        <span>{specialtyName} OPD Only (No Emergency)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-gray-500/15 text-gray-700 border border-gray-500/30 ${className}`}
    >
      <span>ℹ️</span>
      <span>{specialtyName} Emergency Unverified</span>
    </span>
  );
};
