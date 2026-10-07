/**
 * QuantumStateController Component
 * Interactive controller for observing and testing Quantum Activity States in 3D.
 * Allows instant verification of IDLE, ANALYZING, SUCCESS gold pulse, and ERROR red reaction.
 */

import React from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { QuantumActivityState } from '../../types/quantum';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { QuantumActivityBadge } from '../ui/StatusIndicator';
import { Sparkles, Eye, ShieldAlert, CheckCircle, Wind } from 'lucide-react';

export const QuantumStateController: React.FC = () => {
  const { activityState, setActivityState, triggerStatePulse, reducedMotion, setReducedMotion } =
    useQuantum();

  const states: { id: QuantumActivityState; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'IDLE',
      label: 'IDLE',
      desc: 'Calm drift · slow orbit · subtle nodes',
      icon: <Eye className="w-4 h-4 text-[#8B6245]" />,
    },
    {
      id: 'ANALYZING',
      label: 'ANALYZING',
      desc: 'High velocity · dense connections · active core',
      icon: <Sparkles className="w-4 h-4 text-[#C5A46D]" />,
    },
    {
      id: 'SUCCESS',
      label: 'SUCCESS',
      desc: 'Radiant warm-gold pulse · decay to IDLE',
      icon: <CheckCircle className="w-4 h-4 text-[#3D7A5A]" />,
    },
    {
      id: 'ERROR',
      label: 'ERROR',
      desc: 'Subtle warm-red reaction · decay to IDLE',
      icon: <ShieldAlert className="w-4 h-4 text-[#B83A2E]" />,
    },
  ];

  return (
    <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8D2B5]">
        <div>
          <h3 className="text-base font-semibold text-[#2E1E18]">
            3D Quantum Visualizer State Inspector
          </h3>
          <p className="text-xs text-[#8B6245]">
            The LiveQuantumBackground responds in real time to API state transitions
          </p>
        </div>
        <QuantumActivityBadge state={activityState} />
      </div>

      {/* State Switchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {states.map((st) => {
          const isActive = activityState === st.id;
          return (
            <button
              key={st.id}
              onClick={() => {
                if (st.id === 'SUCCESS' || st.id === 'ERROR') {
                  triggerStatePulse(st.id);
                } else {
                  setActivityState(st.id);
                }
              }}
              className={`p-3.5 text-left rounded-2xl border transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#F6EBDD] border-[#B98252] shadow-sm ring-1 ring-[#B98252]'
                  : 'bg-[#FFFDF9] border-[#E8D2B5] hover:border-[#DCC09B] hover:bg-[#F6EBDD]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-[#2E1E18]">{st.label}</span>
                {st.icon}
              </div>
              <p className="text-[11px] text-[#8B6245] leading-snug">{st.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Reduced Motion & Viewport Controls */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B6245]">
        <div className="flex items-center gap-2">
          <span>Three.js Canvas Layer: 60 FPS target</span>
          <span aria-hidden="true">·</span>
          <span>Instanced Spheres & LineSegments</span>
        </div>

        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F6EBDD] text-[#4A3024] hover:text-[#2E1E18] border border-[#E8D2B5] transition-colors cursor-pointer"
        >
          <Wind className="w-3.5 h-3.5 text-[#B98252]" />
          <span>Reduced Motion: {reducedMotion ? 'Enabled (Static)' : 'Disabled (Dynamic)'}</span>
        </button>
      </div>
    </Card>
  );
};
