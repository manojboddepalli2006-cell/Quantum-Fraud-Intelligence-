/**
 * Status Indicator & Metadata Component
 * Compliant with Zero-Pill discipline: renders clean, unboxed metadata
 * with subtle typographic separators (·) and dual color + text signals.
 */

import React from 'react';
import { QuantumActivityState } from '../../types/quantum';
import { RiskLevel } from '../../types/api';

interface StatusIndicatorProps {
  label: string;
  status?: 'nominal' | 'warning' | 'alert' | 'neutral' | 'quantum';
  dotOnly?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status = 'neutral',
  dotOnly = false,
  className = '',
}) => {
  const dotColor = {
    nominal: 'bg-[#3D7A5A]',
    warning: 'bg-[#C5A46D]',
    alert: 'bg-[#B83A2E]',
    neutral: 'bg-[#8B6245]',
    quantum: 'bg-[#B98252]',
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium text-[#4A3024] ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} aria-hidden="true" />
      {!dotOnly && <span className="tabular-nums">{label}</span>}
    </span>
  );
};

export const QuantumActivityBadge: React.FC<{
  state: QuantumActivityState;
  className?: string;
}> = ({ state, className = '' }) => {
  const stateConfig = {
    IDLE: {
      label: 'Quantum Idle',
      subtext: 'Harmonic superposition',
      dotClass: 'bg-[#C5A46D]',
    },
    ANALYZING: {
      label: 'Quantum Active',
      subtext: 'Hamiltonian circuit execution',
      dotClass: 'bg-[#DFB878] animate-ping',
    },
    SUCCESS: {
      label: 'Analysis Resolved',
      subtext: 'Eigenstate converged',
      dotClass: 'bg-[#3D7A5A]',
    },
    ERROR: {
      label: 'Analysis Disrupted',
      subtext: 'Decoherence / network timeout',
      dotClass: 'bg-[#B83A2E]',
    },
  }[state];

  return (
    <div className={`inline-flex items-center gap-2 text-xs text-[#4A3024] font-medium ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {state === 'ANALYZING' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A46D] opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${stateConfig.dotClass}`} />
      </span>
      <span className="font-semibold text-[#2E1E18]">{stateConfig.label}</span>
      <span className="text-[#8B6245]/70" aria-hidden="true">·</span>
      <span className="text-[#8B6245]">{stateConfig.subtext}</span>
    </div>
  );
};

export const RiskIndicator: React.FC<{
  level: RiskLevel;
  score?: number;
  className?: string;
}> = ({ level, score, className = '' }) => {
  const upper = (level || '').toUpperCase();
  const isHigh = upper.includes('HIGH') || upper.includes('CRITICAL') || upper === '1';
  const isMedium = upper.includes('MED');

  const textColor = isHigh
    ? 'text-[#B83A2E]'
    : isMedium
    ? 'text-[#B98252]'
    : 'text-[#3D7A5A]';

  const dotColor = isHigh
    ? 'bg-[#B83A2E]'
    : isMedium
    ? 'bg-[#B98252]'
    : 'bg-[#3D7A5A]';

  return (
    <div className={`inline-flex items-center gap-2 text-xs font-semibold ${textColor} ${className}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{upper || 'UNKNOWN'}</span>
      {score !== undefined && (
        <>
          <span className="text-[#8B6245]/60" aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-[#4A3024]">
            Model Score: {score.toFixed(3)}
          </span>
        </>
      )}
    </div>
  );
};
