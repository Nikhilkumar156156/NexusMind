import React from 'react';
import type { HospitalFacility } from '../types/hospital.types.ts';
import { HospitalCard } from '../components/HospitalCard.tsx';

interface Screen7RecommendedListProps {
  readonly facilities: readonly HospitalFacility[];
  readonly location: string;
  readonly requiredSpecialty: string;
  readonly emergencyRequired: boolean;
  readonly onSelectFacility?: (facility: HospitalFacility) => void;
  readonly onRetrySearch?: () => void;
}

export const Screen7RecommendedList: React.FC<Screen7RecommendedListProps> = ({
  facilities,
  location,
  requiredSpecialty,
  emergencyRequired,
  onSelectFacility,
  onRetrySearch
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Recommended Facilities
          </h2>
          <p className="text-xs text-gray-500">
            Showing facilities near <span className="font-semibold text-gray-700">{location}</span> for{' '}
            <span className="font-semibold text-blue-600">{requiredSpecialty}</span>
          </p>
        </div>
        {emergencyRequired && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-700 border border-red-500/20">
            Emergency Priority
          </span>
        )}
      </div>

      {facilities.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <span className="text-3xl mb-2 block">🏥</span>
          <h3 className="text-sm font-bold text-gray-800">No verified facilities found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Could not verify an emergency-capable {requiredSpecialty} facility in the immediate radius.
          </p>
          {onRetrySearch && (
            <button
              type="button"
              onClick={onRetrySearch}
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Expand Search Radius (100 km)
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {facilities.map((facility) => (
            <HospitalCard
              key={facility.id}
              facility={facility}
              requiredSpecialty={requiredSpecialty}
              onSelect={onSelectFacility}
            />
          ))}
        </div>
      )}
    </div>
  );
};
