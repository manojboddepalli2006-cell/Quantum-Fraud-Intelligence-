/**
 * Quantum3DDonut Component
 * Premium 3D-style ring/donut visualization adhering strictly to the biscuit/warm-cream palette.
 * Visualizes current session risk categories: Low, Medium, High.
 */

import React from 'react';

interface Quantum3DDonutProps {
  low: number;
  medium: number;
  high: number;
  size?: number;
}

export const Quantum3DDonut: React.FC<Quantum3DDonutProps> = ({
  low,
  medium,
  high,
  size = 230,
}) => {
  const total = low + medium + high;

  if (total === 0) {
    return null;
  }

  // Calculate percentages and stroke dasharrays
  const strokeWidth = 24;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const lowPct = low / total;
  const medPct = medium / total;
  const highPct = high / total;

  const lowDash = lowPct * circumference;
  const medDash = medPct * circumference;
  const highDash = highPct * circumference;

  // Offsets
  const lowOffset = 0;
  const medOffset = -lowDash;
  const highOffset = -(lowDash + medDash);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div
        className="relative flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#F6EBDD] to-[#E8D2B5] shadow-[0_12px_36px_rgba(74,48,36,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(74,48,36,0.06)] border border-[#DCC09B]"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 overflow-visible"
        >
          <defs>
            <filter id="donutShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2E1E18" floodOpacity="0.18" />
            </filter>
            {/* Gradients matching biscuit & semantic colors */}
            <linearGradient id="lowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3D7A5A" />
              <stop offset="100%" stopColor="#5E9979" />
            </linearGradient>
            <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A46D" />
              <stop offset="100%" stopColor="#B98252" />
            </linearGradient>
            <linearGradient id="highGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B83A2E" />
              <stop offset="100%" stopColor="#8C251C" />
            </linearGradient>
          </defs>

          {/* Low Segment */}
          {low > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#lowGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${lowDash} ${circumference}`}
              strokeDashoffset={lowOffset}
              filter="url(#donutShadow)"
              className="transition-all duration-500"
            />
          )}

          {/* Medium Segment */}
          {medium > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#medGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${medDash} ${circumference}`}
              strokeDashoffset={medOffset}
              filter="url(#donutShadow)"
              className="transition-all duration-500"
            />
          )}

          {/* High Segment */}
          {high > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#highGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${highDash} ${circumference}`}
              strokeDashoffset={highOffset}
              filter="url(#donutShadow)"
              className="transition-all duration-500"
            />
          )}
        </svg>

        {/* Center Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#8B6245]">
            Total Volume
          </span>
          <span className="text-3xl font-mono font-bold text-[#2E1E18] tabular-nums my-0.5">
            {total}
          </span>
          <span className="text-[10px] text-[#8B6245] font-medium">
            Evaluations
          </span>
        </div>
      </div>

      {/* Legend below donut */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3D7A5A]" />
          <span className="text-[#4A3024]">Low ({low})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B98252]" />
          <span className="text-[#4A3024]">Med ({medium})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B83A2E]" />
          <span className="text-[#4A3024]">High ({high})</span>
        </div>
      </div>
    </div>
  );
};
