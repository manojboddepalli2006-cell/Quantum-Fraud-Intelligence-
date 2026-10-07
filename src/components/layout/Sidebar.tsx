/**
 * Q-FraudX Premium Rounded Sidebar
 * Features:
 * - Brand: Q-FraudX + Subtitle: Quantum Fraud Intelligence
 * - 7 Core Navigation routes with elegant rounded active states
 * - Bottom widget: QUANTUM ENGINE / ONLINE with subtle animated status beacon
 * - Responsive support (collapsible drawer on mobile/tablet)
 */

import React from 'react';
import {
  LayoutDashboard,
  SearchCheck,
  ShieldAlert,
  Cpu,
  BarChart3,
  Database,
  Activity,
  X,
} from 'lucide-react';
import { useQuantum } from '../../context/QuantumContext';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'analyzer', label: 'Transaction Analyzer', icon: <SearchCheck className="w-4 h-4" /> },
  { id: 'fraud-intel', label: 'Fraud Intelligence', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'quantum-engine', label: 'Quantum Engine', icon: <Cpu className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'model-info', label: 'Model Information', icon: <Database className="w-4 h-4" /> },
  { id: 'system-health', label: 'System Health', icon: <Activity className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelect,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activityState, backendConnected } = useQuantum();

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 text-[#2E1E18]">
      {/* 1. Header / Brand */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2E1E18]">
              Q-FraudX
            </h1>
            <p className="text-xs font-medium text-[#8B6245] tracking-wide">
              Quantum Fraud Intelligence
            </p>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-xl text-[#8B6245] hover:text-[#2E1E18] hover:bg-[#F6EBDD] transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Items */}
        <nav aria-label="Sidebar Navigation" className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#F6EBDD] text-[#2E1E18] font-semibold border border-[#DCC09B] shadow-sm shadow-[#2E1E18]/5'
                    : 'text-[#4A3024] hover:bg-[#F6EBDD]/60 hover:text-[#2E1E18] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#B98252]' : 'text-[#8B6245]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="ml-2 font-mono text-[10px] text-[#8B6245]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom Widget: QUANTUM ENGINE ONLINE */}
      <div className="pt-4 border-t border-[#E8D2B5]/80 space-y-3">
        <div className="p-3.5 rounded-2xl bg-[#FFFDF9]/90 border border-[#DCC09B] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8B6245]">
              Quantum Engine
            </span>
            {/* Subtle animated status beacon */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  activityState === 'ANALYZING'
                    ? 'bg-[#DFB878]'
                    : activityState === 'ERROR'
                    ? 'bg-[#B83A2E]'
                    : 'bg-[#3D7A5A]'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  activityState === 'ANALYZING'
                    ? 'bg-[#C5A46D]'
                    : activityState === 'ERROR'
                    ? 'bg-[#B83A2E]'
                    : 'bg-[#3D7A5A]'
                }`}
              />
            </span>
          </div>

          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-[#2E1E18]">
              {activityState === 'ANALYZING'
                ? 'COMPUTING'
                : activityState === 'ERROR'
                ? 'ALERT'
                : 'ONLINE'}
            </span>
            <span className="font-mono text-[11px] text-[#8B6245] tabular-nums">
              {backendConnected ? 'FastAPI 200' : 'Local Standby'}
            </span>
          </div>

          <p className="text-[10px] text-[#8B6245] leading-tight">
            Variational Hamiltonian circuit state: {activityState.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Rounded Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 p-4 z-30">
        <div className="h-full w-full bg-[#FFFDF9]/85 backdrop-blur-md rounded-3xl border border-[#E8D2B5] shadow-[0_8px_30px_rgba(46,30,24,0.05)] overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#2E1E18]/30 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#FFFDF9] border-r border-[#E8D2B5] shadow-2xl p-2 z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
