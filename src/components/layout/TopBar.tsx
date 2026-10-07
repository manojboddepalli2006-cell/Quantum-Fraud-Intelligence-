/**
 * TopBar Component
 * Displays:
 * - Dynamic Page Title & Description
 * - Premium rounded Backend Status badge
 * - Premium rounded Quantum Engine Status badge
 * - Quick actions (Backend Configuration modal trigger & Refresh)
 * - Mobile hamburger toggle
 */

import React from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Button } from '../ui/Button';
import { Sliders, RefreshCw, Menu } from 'lucide-react';

interface TopBarProps {
  activeId: string;
  onOpenSettings: () => void;
  onOpenMobileMenu: () => void;
}

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  overview: {
    title: 'Executive Intelligence Overview',
    description: 'Quantum-enhanced transaction telemetry and live decision matrix.',
  },
  analyzer: {
    title: 'Transaction Analyzer',
    description: 'Direct FastAPI evaluation of 6-dimensional latent quantum feature vectors.',
  },
  'fraud-intel': {
    title: 'Fraud Intelligence Matrix',
    description: 'Hilbert space separation of high-velocity synthetic anomalies.',
  },
  'quantum-engine': {
    title: 'Quantum Variational Engine',
    description: 'Parameterized ansatz circuits and dynamic Hamiltonian simulation.',
  },
  analytics: {
    title: 'Dimensionality & Variance Analytics',
    description: 'Principal component loadings, distribution curves, and risk clusters.',
  },
  'model-info': {
    title: 'Model & Circuit Information',
    description: 'Live Qiskit metadata, ansatz depth, and feature vector contracts.',
  },
  'system-health': {
    title: 'System Health & Diagnostics',
    description: 'FastAPI microservice heartbeat, network latency, and CORS status.',
  },
};

export const TopBar: React.FC<TopBarProps> = ({
  activeId,
  onOpenSettings,
  onOpenMobileMenu,
}) => {
  const {
    backendConnected,
    isCheckingHealth,
    activityState,
    lastLatencyMs,
    refreshBackendStatus,
  } = useQuantum();

  const currentMeta = PAGE_METADATA[activeId] || {
    title: 'Quantum Fraud Intelligence',
    description: 'Quantum-enhanced financial anomaly detection platform.',
  };

  const quantumStateConfig = {
    IDLE: { label: 'Quantum Idle', dot: 'bg-[#C5A46D]', ring: 'ring-[#C5A46D]/30' },
    ANALYZING: { label: 'Quantum Active', dot: 'bg-[#DFB878] animate-ping', ring: 'ring-[#DFB878]/50' },
    SUCCESS: { label: 'Resolved (Converged)', dot: 'bg-[#3D7A5A]', ring: 'ring-[#3D7A5A]/30' },
    ERROR: { label: 'Alert (Disrupted)', dot: 'bg-[#B83A2E]', ring: 'ring-[#B83A2E]/30' },
  }[activityState];

  return (
    <header className="sticky top-0 z-20 w-full bg-[#FFFDF9]/85 backdrop-blur-md border-b border-[#E8D2B5] transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile Toggle + Page Title & Description */}
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#8B6245] hover:text-[#2E1E18] hover:bg-[#F6EBDD] transition-colors mt-0.5 sm:mt-0 cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2E1E18] tracking-tight">
              {currentMeta.title}
            </h2>
            <p className="text-xs text-[#8B6245] line-clamp-1 max-w-xl">
              {currentMeta.description}
            </p>
          </div>
        </div>

        {/* Right: Premium Rounded Badges & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* 1. Quantum Engine Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#DCC09B] shadow-xs text-xs font-medium text-[#4A3024]">
            <span className="relative flex h-2 w-2">
              <span className={`relative inline-flex rounded-full h-2 w-2 ${quantumStateConfig.dot}`} />
            </span>
            <span className="font-semibold text-[#2E1E18]">{quantumStateConfig.label}</span>
          </div>

          {/* 2. Backend Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#DCC09B] shadow-xs text-xs font-medium text-[#4A3024]">
            <span
              className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-[#3D7A5A]' : 'bg-[#B83A2E]'
              }`}
              aria-hidden="true"
            />
            <span>{backendConnected ? 'FastAPI Online' : 'FastAPI Offline'}</span>
            {lastLatencyMs !== null && backendConnected && (
              <>
                <span className="text-[#8B6245]/50" aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[11px] text-[#8B6245]">
                  {lastLatencyMs}ms
                </span>
              </>
            )}
          </div>

          {/* 3. Re-check Heartbeat Button */}
          <button
            onClick={() => refreshBackendStatus()}
            disabled={isCheckingHealth}
            title="Refresh backend status"
            className="p-2 rounded-xl text-[#8B6245] hover:text-[#2E1E18] hover:bg-[#F6EBDD] transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isCheckingHealth ? 'animate-spin' : ''}`} />
          </button>

          {/* 4. Settings Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            leftIcon={<Sliders className="w-3.5 h-3.5" />}
          >
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
};
