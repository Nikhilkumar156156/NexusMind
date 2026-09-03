import React from 'react';
import type { VerificationStatus } from '../types/hospital.types.ts';

interface VerificationBadgeProps {
  readonly status: VerificationStatus;
  readonly className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'verified':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Verified
        </span>
      );
    case 'partially_verified':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Partially Verified
        </span>
      );
    case 'unverified':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-600 border border-gray-500/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Unverified
        </span>
      );
  }
};
