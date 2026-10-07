/**
 * Quantum3DGauge Component
 * Animated circular 3D gauge for visualizing the model's fraud_score.
 * Enforces rule: fraud_score is a MODEL SCORE (not probability or percentage).
 * Displays value formatted as 0.xxx with smooth animation.
 */

import React, { useEffect, useState } from 'react';

interface Quantum3DGaugeProps {
  score: number; // 0.0 to 1.0 (or normalized model score)
  riskLevel?: string;
  size?: number;
  className?: string;
}

export const Quantum3DGauge: React.FC<Quantum3DGaugeProps> = ({
  score,
  riskLevel = 'LOW',
  size = 220,
  className = '',
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Smooth lerp animation for gauge display
  useEffect(() => {
    let frameId: number;
    const startScore = animatedScore;
    const targetScore = Math.max(0, Math.min(1, score));
    const startTime = performance.now();
    const duration = 900; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(startScore + (targetScore - startScore) * ease);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  // Gauge calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  // Arc from 135deg to 405deg (270 degrees total)
  const totalAngle = 270;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalAngle / 360) * circumference;
  const progressOffset = arcLength - (animatedScore * (totalAngle / 360) * circumference);

  // Color depending on model score
  const isHigh = animatedScore >= 0.5 || riskLevel.toUpperCase().includes('HIGH') || riskLevel.toUpperCase().includes('CRITICAL');
  const isMed = animatedScore >= 0.2 && !isHigh;

  const accentColor = isHigh ? '#B83A2E' : isMed ? '#B98252' : '#C5A46D';
  const trackColor = '#E8D2B5';

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Gauge SVG Container with drop shadow & embossed bevel */}
      <div
        className="relative flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#F6EBDD] to-[#E8D2B5] shadow-[0_12px_32px_rgba(74,48,36,0.12),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_4px_rgba(74,48,36,0.08)] border border-[#DCC09B]"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform rotate-[135deg] overflow-visible"
        >
          <defs>
            {/* 3D Gradient for Arc */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A46D" />
              <stop offset="50%" stopColor={isHigh ? '#B83A2E' : isMed ? '#B98252' : '#DFB878'} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>

            {/* Inner Shadow Filter */}
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2E1E18" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            opacity={0.35}
          />

          {/* Active 3D Colored Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            filter="url(#gaugeShadow)"
            className="transition-all duration-150"
          />
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 select-none">
          {/* Label (Rule: fraud_score is a MODEL SCORE, never probability) */}
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#8B6245]">
            Model Score
          </span>

          {/* Score formatted as 0.xxx */}
          <div className="flex items-baseline justify-center my-1">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#2E1E18] tabular-nums tracking-tight">
              {animatedScore.toFixed(3)}
            </span>
          </div>

          {/* Scale indicator */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8B6245]">
            <span>0.000</span>
            <span className="text-[#8B6245]/40" aria-hidden="true">—</span>
            <span>1.000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
