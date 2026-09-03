import React from 'react';

interface Screen6HospitalSearchProps {
  readonly location: string;
  readonly requiredSpecialty: string;
  readonly emergencyRequired: boolean;
  readonly activeQuery?: string;
  readonly discoveredCount?: number;
}

export const Screen6HospitalSearch: React.FC<Screen6HospitalSearchProps> = ({
  location,
  requiredSpecialty,
  emergencyRequired,
  activeQuery,
  discoveredCount = 0
}) => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 animate-pulse">
        <span className="text-2xl">🔍</span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Searching Facilities near {location}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Agent 2 is actively researching hospital department capabilities via Google Search MCP...
      </p>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-left mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-semibold">Target Location:</span>
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-semibold">Required Specialty:</span>
          <span className="font-medium text-blue-600">{requiredSpecialty}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-semibold">Emergency Department:</span>
          <span className={emergencyRequired ? 'text-red-600 font-bold' : 'text-gray-500'}>
            {emergencyRequired ? 'MANDATORY (24x7)' : 'Optional'}
          </span>
        </div>
        {activeQuery && (
          <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-400 font-mono truncate">
            Active Query: {activeQuery}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        <span>Evaluating OPD vs. Emergency coverage ({discoveredCount} candidates identified)</span>
      </div>
    </div>
  );
};
