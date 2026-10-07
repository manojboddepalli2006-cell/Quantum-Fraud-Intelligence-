/**
 * Q-FraudX — Quantum Fraud Intelligence
 * Global Layout: Premium Rounded Sidebar + Dynamic Top Bar + Live 3D Background + Content
 */

import React, { useState } from 'react';
import { QuantumProvider, useQuantum } from './context/QuantumContext';
import { LiveQuantumBackground } from './components/quantum/LiveQuantumBackground';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';
import { OverviewView } from './components/views/OverviewView';
import { TransactionAnalyzer } from './components/quantum/TransactionAnalyzer';
import { FraudIntelView } from './components/views/FraudIntelView';
import { QuantumEngineView } from './components/views/QuantumEngineView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ModelSpecsView } from './components/views/ModelSpecsView';
import { DiagnosticsView } from './components/views/DiagnosticsView';
import { BackendConfigModal } from './components/quantum/BackendConfigModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen flex text-[#2E1E18] font-sans overflow-x-hidden">
      {/* 1. Live 3D Quantum Canvas Background (Mouse parallax + Biscuit palette) */}
      <LiveQuantumBackground showGrid={true} />

      {/* 2. Premium Rounded Sidebar */}
      <Sidebar
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 3. Main Application Column */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Bar with dynamic metadata and rounded badges */}
        <TopBar
          activeId={activeTab}
          onOpenSettings={() => setIsConfigOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {activeTab === 'overview' && (
            <OverviewView onNavigate={(id) => setActiveTab(id)} />
          )}

          {activeTab === 'analyzer' && (
            <div className="space-y-6">
              <TransactionAnalyzer />
            </div>
          )}

          {activeTab === 'fraud-intel' && (
            <FraudIntelView onNavigate={(id) => setActiveTab(id)} />
          )}

          {activeTab === 'quantum-engine' && <QuantumEngineView />}

          {activeTab === 'analytics' && (
            <AnalyticsView onNavigate={(id) => setActiveTab(id)} />
          )}

          {activeTab === 'model-info' && <ModelSpecsView />}

          {activeTab === 'system-health' && <DiagnosticsView />}
        </main>

        {/* Quiet Editorial Footer */}
        <Footer />
      </div>

      {/* 4. Backend Configuration Modal */}
      <BackendConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <QuantumProvider>
      <AppContent />
    </QuantumProvider>
  );
}
