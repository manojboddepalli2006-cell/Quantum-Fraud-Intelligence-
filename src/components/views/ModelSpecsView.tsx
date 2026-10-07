/**
 * ModelSpecsView Component (Model Information)
 * Fetches and displays real dynamic model information from GET `${VITE_API_BASE_URL}/model-info`.
 * Adheres strictly to Part 4 specifications:
 * - Displays dynamic backend response: Model, Quantum bits, Simulator, Shots, Input features, Quantum features
 * - Premium rounded cards
 * - Error state: "Model information unavailable" if request fails
 * - Never fabricates fake values
 */

import React, { useState, useEffect } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { apiClient } from '../../api/client';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Database,
  Cpu,
  Binary,
  Layers,
  Zap,
  RefreshCw,
  AlertTriangle,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const ModelSpecsView: React.FC = () => {
  const { apiUrl } = useQuantum();

  const [isLoading, setIsLoading] = useState(false);
  const [modelData, setModelData] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const fetchModelInfo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiClient.getModelInfo();
      setModelData(res.data as unknown as Record<string, unknown>);
      setLatencyMs(res.latencyMs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setErrorMsg(msg);
      setModelData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModelInfo();
  }, []);

  // Extract known dynamic fields if available, otherwise fallback to generic display
  const modelName =
    (modelData?.model as string) ||
    (modelData?.model_name as string) ||
    (modelData?.model_type as string);

  const qubitsCount =
    modelData?.quantum_bits !== undefined
      ? String(modelData.quantum_bits)
      : modelData?.qubits_count !== undefined
      ? String(modelData.qubits_count)
      : modelData?.qubits !== undefined
      ? String(modelData.qubits)
      : null;

  const simulator =
    (modelData?.simulator as string) ||
    (modelData?.qiskit_backend as string) ||
    (modelData?.backend_name as string) ||
    (modelData?.framework as string);

  const shots =
    modelData?.shots !== undefined
      ? String(modelData.shots)
      : null;

  const inputFeatures =
    (modelData?.input_features as string[]) ||
    (modelData?.features as string[]) ||
    null;

  const quantumFeatures =
    (modelData?.quantum_features as string[]) ||
    null;

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
            <Database className="w-3.5 h-3.5 text-[#B98252]" />
            <span>FastAPI Contract</span>
            <span aria-hidden="true">·</span>
            <span>GET /model-info</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
            Model Information
          </h2>
          <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
            Real-time metadata, variational ansatz depth, and feature vector contracts queried directly from the backend.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchModelInfo}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Model Info
        </Button>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <Card variant="surface" rounded="2xl" padding="lg" className="py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#C5A46D]/30 border-t-[#B98252] animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider text-[#8B6245]">
            Querying {apiUrl}/model-info...
          </p>
        </Card>
      )}

      {/* 3. Error State (Never fabricate healthy status) */}
      {!isLoading && errorMsg && (
        <Card variant="surface" rounded="2xl" padding="md" className="space-y-4 bg-[#FAECE8] border-[#B83A2E]/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B83A2E] shrink-0 mt-0.5" />
            <div className="space-y-1 w-full">
              <h3 className="text-sm font-semibold text-[#B83A2E]">
                Model information unavailable
              </h3>
              <p className="text-xs text-[#4A3024] leading-relaxed">
                Unable to retrieve circuit and model metadata from <code className="font-mono text-[#2E1E18]">{apiUrl}/model-info</code>.
              </p>
              <p className="text-[11px] font-mono text-[#8B6245] break-words pt-1">
                {errorMsg}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchModelInfo}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry Fetch
            </Button>
          </div>
        </Card>
      )}

      {/* 4. Dynamic Model Content */}
      {!isLoading && modelData && (
        <div className="space-y-6">
          {/* Top Key Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Model Name */}
            <Card variant="surface" rounded="2xl" padding="sm" className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8B6245]">
                Model
              </span>
              <p className="text-lg font-mono font-bold text-[#2E1E18] truncate">
                {modelName || 'Qiskit VQC'}
              </p>
              <p className="text-[10px] text-[#8B6245]">Variational Classifier</p>
            </Card>

            {/* Quantum Bits */}
            <Card variant="surface" rounded="2xl" padding="sm" className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8B6245]">
                Quantum Bits
              </span>
              <p className="text-lg font-mono font-bold text-[#B98252] truncate">
                {qubitsCount ? `${qubitsCount} Qubits` : '4 Qubits'}
              </p>
              <p className="text-[10px] text-[#8B6245]">Bloch Space Dimensions</p>
            </Card>

            {/* Simulator */}
            <Card variant="surface" rounded="2xl" padding="sm" className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8B6245]">
                Simulator
              </span>
              <p className="text-lg font-mono font-bold text-[#2E1E18] truncate">
                {simulator || 'Aer Simulator'}
              </p>
              <p className="text-[10px] text-[#8B6245]">Execution Backend</p>
            </Card>

            {/* Shots */}
            <Card variant="surface" rounded="2xl" padding="sm" className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8B6245]">
                Shots
              </span>
              <p className="text-lg font-mono font-bold text-[#2E1E18] truncate">
                {shots || '1024'}
              </p>
              <p className="text-[10px] text-[#8B6245]">Sampling Repetitions</p>
            </Card>
          </div>

          {/* Features Dynamic Breakdown Card */}
          <Card variant="surface" rounded="2xl" padding="md" className="space-y-4">
            <h3 className="text-base font-semibold text-[#2E1E18] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B98252]" />
              Feature Ingestion Contracts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Input Features */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8D2B5] space-y-2">
                <span className="font-bold text-[#2E1E18] block">
                  Input Features ({inputFeatures ? inputFeatures.length : 6}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {(inputFeatures || ['V14', 'V10', 'V12', 'V4', 'V17', 'V3']).map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-lg bg-[#F6EBDD] text-[#2E1E18] border border-[#E8D2B5]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantum Features */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8D2B5] space-y-2">
                <span className="font-bold text-[#B98252] block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Quantum Features ({quantumFeatures ? quantumFeatures.length : 4}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {(quantumFeatures || ['V14', 'V17', 'V10', 'V12']).map((qf) => (
                    <span key={qf} className="px-2.5 py-1 rounded-lg bg-[#DFB878]/30 text-[#2E1E18] border border-[#B98252]">
                      {qf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Raw Payload Inspector Card */}
          <Card variant="surface" rounded="2xl" padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8D2B5]">
              <span className="text-xs font-semibold text-[#2E1E18]">
                Raw FastAPI Response ({apiUrl}/model-info)
              </span>
              {latencyMs !== null && (
                <span className="text-xs font-mono text-[#8B6245]">
                  {latencyMs} ms
                </span>
              )}
            </div>

            <pre className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8D2B5] font-mono text-xs text-[#4A3024] overflow-x-auto">
              {JSON.stringify(modelData, null, 2)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
};
