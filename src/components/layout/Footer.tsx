/**
 * Footer Component
 * Refined editorial footer with genuine copyright and architecture information.
 * Eradicates fake tickers or ornamental status engines.
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E8D2B5] bg-[#F6EBDD]/70 py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8B6245]">
        {/* Left: Brand & Statement */}
        <div className="space-y-1 text-center md:text-left">
          <p className="font-semibold text-[#2E1E18] text-sm">Q-FraudX · Quantum Fraud Intelligence</p>
          <p>Quantum-enhanced financial anomaly detection powered by Qiskit and variational quantum circuits.</p>
        </div>

        {/* Center: Real Contract Metadata */}
        <div className="flex items-center gap-3 text-center">
          <span>FastAPI Engine</span>
          <span aria-hidden="true">·</span>
          <span>Six-Feature Vector (V14, V10, V12, V4, V17, V3)</span>
          <span aria-hidden="true">·</span>
          <span>Three.js Quantum Visualizer</span>
        </div>

        {/* Right: Copyright */}
        <div className="text-center md:text-right">
          <p>© {new Date().getFullYear()} Q-FraudX. Designed for Academic & FinTech Demonstrations.</p>
        </div>
      </div>
    </footer>
  );
};
