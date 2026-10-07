/**
 * LiveQuantumBackground
 * Living 3D WebGL background reacting to quantum activity state:
 * IDLE, ANALYZING, SUCCESS, ERROR
 * Maintains legibility with luxury warm cream contrast scrims and subtle quantum grid.
 */

import React, { useEffect, useRef } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { QuantumSceneManager } from '../../three/quantumScene';

interface LiveQuantumBackgroundProps {
  className?: string;
  showGrid?: boolean;
}

export const LiveQuantumBackground: React.FC<LiveQuantumBackgroundProps> = ({
  className = '',
  showGrid = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<QuantumSceneManager | null>(null);
  const { activityState, reducedMotion } = useQuantum();

  // Mount Three.js Quantum Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new QuantumSceneManager({
      container: containerRef.current,
      initialState: activityState,
      reducedMotion,
    });
    sceneManagerRef.current = manager;

    return () => {
      manager.destroy();
      sceneManagerRef.current = null;
    };
  }, []); // Run on mount

  // Sync state transitions to 3D scene
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setActivityState(activityState);
    }
  }, [activityState]);

  // Sync reduced motion preference
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setReducedMotion(reducedMotion);
    }
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      {/* 1. Underlying warm canvas gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#F6EBDD] opacity-95" />

      {/* 2. Three.js Living Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* 3. Subtle Quantum Atmospheric Grid (optional subtle quantum field) */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #4A3024 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      )}

      {/* 4. Soft Vignette to keep text crystal clear and focus centered */}
      <div
        className="absolute inset-0 bg-radial-[circle_at_center,_transparent_45%,_rgba(246,235,221,0.55)_100%]"
      />

      {/* 5. Active state atmospheric highlight ring */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          activityState === 'ANALYZING'
            ? 'opacity-40 bg-radial-[circle_at_50%_35%,_rgba(197,164,109,0.18)_0%,_transparent_65%]'
            : activityState === 'SUCCESS'
            ? 'opacity-60 bg-radial-[circle_at_50%_35%,_rgba(223,184,120,0.25)_0%,_transparent_70%]'
            : activityState === 'ERROR'
            ? 'opacity-40 bg-radial-[circle_at_50%_35%,_rgba(184,58,46,0.18)_0%,_transparent_65%]'
            : 'opacity-0'
        }`}
      />
    </div>
  );
};
