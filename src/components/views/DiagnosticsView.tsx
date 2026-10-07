/**
 * SystemHealthView (DiagnosticsView) Component
 * System Health dashboard adhering strictly to Part 4 specifications:
 * - Real API call: GET `${VITE_API_BASE_URL}/health`
 * - Displays: Backend, API, Model, Quantum Engine
 * - States: CONNECTED, OFFLINE, CHECKING
 * - "Refresh Status" action
 * - 3D Health Visualization with glowing nodes, connection lines, pulse animation
 * - Error state: "Backend connection unavailable" (never fabricates healthy status)
 */

import React, { useState, useEffect } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { apiClient } from '../../api/client';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SystemHealthNetworkCanvas } from '../quantum/SystemHealthNetworkCanvas';
import {
  Activity,
  Server,
  Cpu,
  Layers,
  Network,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const DiagnosticsView: React.FC = () => {
  const { apiUrl, backendConnected, lastLatencyMs, refreshBackendStatus } = useQuantum();

  const [isChecking, setIsChecking] = useState(false);
  const [healthPayload, setHealthPayload] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const executeHealthCheck = async () => {
    setIsChecking(true);
    setErrorMsg(null);
    try {
      const res = await apiClient.checkHealth();
      setHealthPayload(res.data as unknown as Record<string, unknown>);
      await refreshBackendStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setErrorMsg(msg);
      setHealthPayload(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    executeHealthCheck();
  }, []);

  // System status state
  const currentStatus: 'CONNECTED' | 'OFFLINE' | 'CHECKING' = isChecking
    ? 'CHECKING'
    : backendConnected
    ? 'CONNECTED'
    : 'OFFLINE';

  const componentHealthItems = [
    {
      name: 'Backend',
      subtext: 'FastAPI Python Service',
      icon: <Server className="w-4 h-4 text-[#B98252]" />,
      desc: 'Authoritative decision boundary host',
    },
    {
      name: 'API',
      subtext: 'REST Endpoints & CORS',
      icon: <Network className="w-4 h-4 text-[#B98252]" />,
      desc: '/health, /model-info, /predict routing',
    },
    {
      name: 'Model',
      subtext: 'Variational Quantum Classifier',
      icon: <Layers className="w-4 h-4 text-[#B98252]" />,
      desc: 'ZZFeatureMap + RealAmplitudes weights',
    },
    {
      name: 'Quantum Engine',
      subtext: 'Qiskit Simulation Runtime',
      icon: <Cpu className="w-4 h-4 text-[#B98252]" />,
      desc: 'Hilbert space state vector evaluation',
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Header with Refresh Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
            <Activity className="w-3.5 h-3.5 text-[#B98252]" />
            <span>Telemetry Pulse</span>
            <span aria-hidden="true">·</span>
            <span>GET /health</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
            System Health & Diagnostics
          </h2>
          <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
            Real-time heartbeat verification, API response latencies, and 3D system network integrity.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={executeHealthCheck}
          isLoading={isChecking}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />}
        >
          Refresh Status
        </Button>
      </div>

      {/* 2. 3D System Health Network Visualization Card */}
      <Card
        variant="elevated"
        rounded="3xl"
        padding="none"
        className="overflow-hidden border-[#DCC09B] shadow-[0_12px_40px_rgba(74,48,36,0.08)] bg-gradient-to-br from-[#FFFDF9] via-[#F6EBDD]/90 to-[#E8D2B5]/50"
      >
        <div className="p-6 sm:p-8 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8D2B5]/80">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2E1E18] flex items-center gap-2">
              <Network className="w-5 h-5 text-[#B98252]" />
              3D System Network Telemetry
            </h3>
            <p className="text-xs text-[#8B6245]">
              Real-time node status across Backend, API, Model, and Quantum Engine
            </p>
          </div>

          {/* Master Status Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold inline-flex items-center gap-2 ${
              currentStatus === 'CONNECTED'
                ? 'bg-[#EDF5F0] text-[#3D7A5A] border-[#3D7A5A]/30'
                : currentStatus === 'OFFLINE'
                ? 'bg-[#FAECE8] text-[#B83A2E] border-[#B83A2E]/30'
                : 'bg-[#F6EBDD] text-[#C5A46D] border-[#C5A46D]/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentStatus === 'CONNECTED'
                  ? 'bg-[#3D7A5A]'
                  : currentStatus === 'OFFLINE'
                  ? 'bg-[#B83A2E]'
                  : 'bg-[#C5A46D] animate-ping'
              }`}
            />
            <span>{currentStatus}</span>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        <SystemHealthNetworkCanvas status={currentStatus} />
      </Card>

      {/* 3. Error State (Never fabricate healthy status) */}
      {!isChecking && !backendConnected && (
        <Card variant="surface" rounded="2xl" padding="md" className="space-y-4 bg-[#FAECE8] border-[#B83A2E]/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B83A2E] shrink-0 mt-0.5" />
            <div className="space-y-1 w-full">
              <h3 className="text-sm font-semibold text-[#B83A2E]">
                Backend connection unavailable
              </h3>
              <p className="text-xs text-[#4A3024] leading-relaxed">
                Unable to connect to the Q-FraudX backend at <code className="font-mono text-[#2E1E18]">{apiUrl}/health</code>.
              </p>
              {errorMsg && (
                <p className="text-[11px] font-mono text-[#8B6245] break-words pt-1">
                  Reason: {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* Diagnostic steps */}
          <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E8D2B5] text-xs space-y-1 text-[#8B6245]">
            <p className="font-semibold text-[#2E1E18]">Verification checklist:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Ensure Python FastAPI is running: <code className="font-mono text-[#2E1E18]">uvicorn main:app --reload --port 8000</code></li>
              <li>Confirm CORS middleware allows browser origins (<code className="font-mono text-[#2E1E18]">allow_origins=[&quot;*&quot;]</code>)</li>
              <li>Check your network proxy or URL configuration in Settings</li>
            </ul>
          </div>
        </Card>
      )}

      {/* 4. Four Component Cards (Backend, API, Model, Quantum Engine) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {componentHealthItems.map((comp) => {
          // Rule: Never show CONNECTED if the real API request failed
          const compState = isChecking
            ? 'CHECKING'
            : backendConnected
            ? 'CONNECTED'
            : 'OFFLINE';

          const stateClasses =
            compState === 'CONNECTED'
              ? 'text-[#3D7A5A] bg-[#EDF5F0] border-[#3D7A5A]/30'
              : compState === 'OFFLINE'
              ? 'text-[#B83A2E] bg-[#FAECE8] border-[#B83A2E]/30'
              : 'text-[#C5A46D] bg-[#F6EBDD] border-[#C5A46D]/40';

          return (
            <Card key={comp.name} variant="surface" rounded="2xl" padding="sm" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#F6EBDD] text-[#8B6245]">
                    {comp.icon}
                  </div>
                  <span className="font-semibold text-sm text-[#2E1E18]">{comp.name}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${stateClasses}`}>
                  {compState}
                </span>
              </div>

              <div className="space-y-0.5 text-xs">
                <p className="text-[#8B6245] font-medium">{comp.subtext}</p>
                <p className="text-[11px] text-[#4A3024]">{comp.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 5. Live Payload & Network Specifications */}
      {backendConnected && healthPayload && (
        <Card variant="surface" rounded="2xl" padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8D2B5]">
            <h3 className="text-sm font-semibold text-[#2E1E18] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3D7A5A]" />
              Heartbeat Response Payload ({apiUrl}/health)
            </h3>
            {lastLatencyMs !== null && (
              <span className="text-xs font-mono text-[#8B6245] tabular-nums">
                Latency: {lastLatencyMs} ms
              </span>
            )}
          </div>

          <pre className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8D2B5] font-mono text-xs text-[#4A3024] overflow-x-auto">
            {JSON.stringify(healthPayload, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};
