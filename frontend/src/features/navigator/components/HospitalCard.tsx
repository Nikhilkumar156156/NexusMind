import React from 'react';
import type { HospitalFacility } from '../types/hospital.types.ts';
import { VerificationBadge } from './VerificationBadge.tsx';
import { EmergencyStatusPill } from './EmergencyStatusPill.tsx';

interface HospitalCardProps {
  readonly facility: HospitalFacility;
  readonly requiredSpecialty: string;
  readonly onSelect?: (facility: HospitalFacility) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  facility,
  requiredSpecialty,
  onSelect
}) => {
  const isEmergencyCapable = facility.specialtyMode === 'EMERGENCY_AND_OPD';

  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 ${
        isEmergencyCapable
          ? 'border-emerald-500/30 bg-white hover:border-emerald-500 hover:shadow-md'
          : 'border-amber-500/30 bg-amber-50/20 hover:border-amber-500'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-lg font-bold text-gray-900">{facility.name}</h3>
            <VerificationBadge status={facility.verificationStatus} />
          </div>
          <p className="text-xs text-gray-500">{facility.address}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold text-gray-900">{facility.distanceKm.toFixed(1)} km</span>
          <p className="text-xs text-gray-400">estimated</p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-2 flex-wrap">
        <EmergencyStatusPill
          specialtyMode={facility.specialtyMode}
          specialtyName={requiredSpecialty}
          emergencySpecialtyVerified={facility.emergencySpecialtyVerified}
        />
        {facility.hasEmergencyDepartment && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Emergency Desk
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
        {facility.verificationNotes}
      </p>

      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
        {facility.contactNumber ? (
          <a
            href={`tel:${facility.contactNumber}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>📞 Call Desk</span>
            <span className="text-gray-500">({facility.contactNumber})</span>
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">No phone verified</span>
        )}

        <div className="flex items-center gap-2">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(facility.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🧭 Directions
          </a>
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(facility)}
              className="inline-flex items-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
