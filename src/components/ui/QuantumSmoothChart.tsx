/**
 * QuantumSmoothChart Component
 * Visualizes current-session fraud scores along a smooth Bézier trajectory.
 * Adheres strictly to the biscuit/cream palette.
 * Clearly labeled: CURRENT SESSION.
 */

import React, { useState } from 'react';
import { SessionTransactionRecord } from '../../types/api';

interface QuantumSmoothChartProps {
  records: SessionTransactionRecord[];
  height?: number;
}

export const QuantumSmoothChart: React.FC<QuantumSmoothChartProps> = ({
  records,
  height = 240,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (records.length === 0) {
    return null;
  }

  // Reverse so oldest is left, newest is right
  const chronological = [...records].reverse();

  // Width & height setup
  const width = 640;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  // Map data to coordinates (fraud score range 0.0 to 1.0)
  const points = chronological.map((rec, idx) => {
    const x =
      chronological.length === 1
        ? width / 2
        : paddingX + (idx / (chronological.length - 1)) * innerWidth;
    const y = paddingTop + (1 - Math.max(0, Math.min(1, rec.fraud_score))) * innerHeight;
    return { x, y, rec };
  });

  // Build smooth curve path
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${paddingX} ${points[0].y} L ${width - paddingX} ${points[0].y}`;
  } else {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Closed area under curve for soft warm gradient
  const areaD =
    points.length === 1
      ? `${pathD} L ${width - paddingX} ${height - paddingBottom} L ${paddingX} ${height - paddingBottom} Z`
      : `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  // Decision threshold at 0.50
  const thresholdY = paddingTop + (1 - 0.5) * innerHeight;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5A46D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F6EBDD" stopOpacity="0.02" />
          </linearGradient>

          <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#B98252" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Horizontal Baseline Grids */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
          const y = paddingTop + (1 - v) * innerHeight;
          return (
            <g key={v}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E8D2B5"
                strokeWidth={v === 0.5 ? 1.5 : 0.75}
                strokeDasharray={v === 0.5 ? '4 3' : '2 2'}
                opacity={v === 0.5 ? 0.8 : 0.45}
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] font-mono fill-[#8B6245] tabular-nums"
              >
                {v.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* 0.50 Threshold Marker Label */}
        <text
          x={width - paddingX + 6}
          y={thresholdY + 3}
          className="text-[8px] font-mono font-bold fill-[#B83A2E]"
        >
          0.50 CUTOFF
        </text>

        {/* Area Fill */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Smooth Trajectory Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#B98252"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Evaluation Points */}
        {points.map((pt, i) => {
          const isSelected = hoveredIdx === i;
          const isHigh = pt.rec.fraud_score >= 0.5;

          return (
            <g
              key={pt.rec.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Outer halo on hover */}
              {isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill={isHigh ? '#B83A2E' : '#C5A46D'}
                  opacity="0.2"
                />
              )}

              {/* Point core */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? '5.5' : '4'}
                fill={isHigh ? '#B83A2E' : '#2E1E18'}
                stroke="#FFFDF9"
                strokeWidth="2"
                filter="url(#pointGlow)"
              />

              {/* Timestamp label on X axis */}
              <text
                x={pt.x}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                className="text-[8px] font-mono fill-[#8B6245]"
              >
                {pt.rec.time.slice(0, 5)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip when Point is Hovered */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-[#2E1E18] text-[#FFF9F0] text-xs font-mono shadow-xl border border-[#4A3024] -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 - 8}%`,
          }}
        >
          <div className="flex items-center justify-between gap-3 font-bold">
            <span>TX #{chronological.length - hoveredIdx}</span>
            <span className="text-[#DFB878]">
              Score: {points[hoveredIdx].rec.fraud_score.toFixed(3)}
            </span>
          </div>
          <div className="text-[10px] text-[#DCC09B] mt-0.5 flex justify-between gap-3">
            <span>Risk: {points[hoveredIdx].rec.risk_level}</span>
            <span>{points[hoveredIdx].rec.time}</span>
          </div>
        </div>
      )}
    </div>
  );
};
