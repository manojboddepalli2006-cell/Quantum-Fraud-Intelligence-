/**
 * BackendConfigModal Component
 * Allows user to view and test the FastAPI backend URL (VITE_API_BASE_URL).
 * Checks GET /health and GET /model-info live.
 */

import React, { useState } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CheckCircle2, AlertCircle, RefreshCw, Server } from 'lucide-react';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    apiUrl,
    setApiUrl,
    backendConnected,
    isCheckingHealth,
    healthData,
    modelInfo,
    backendError,
    lastLatencyMs,
    refreshBackendStatus,
  } = useQuantum();

  const [inputUrl, setInputUrl] = useState(apiUrl);

  const handleSave = async () => {
    setApiUrl(inputUrl);
    await refreshBackendStatus();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FastAPI Backend Configuration"
      description="Connect to your Python FastAPI service running Qiskit and the quantum model."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshBackendStatus}
              isLoading={isCheckingHealth}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Test Connection
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save & Reconnect
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Backend URL Input */}
        <div className="space-y-2">
          <Input
            label="API Base URL (VITE_API_BASE_URL)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            helperText="Default: http://localhost:8000 (standard FastAPI uvicorn address)"
            leftAddon={<Server className="w-4 h-4" />}
          />
        </div>

        {/* Live Status Summary Card */}
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            backendConnected
              ? 'bg-[#EDF5F0] border-[#3D7A5A]/30'
              : 'bg-[#FAECE8] border-[#B83A2E]/30'
          }`}
        >
          <div className="flex items-start gap-3">
            {backendConnected ? (
              <CheckCircle2 className="w-5 h-5 text-[#3D7A5A] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#B83A2E] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#2E1E18]">
                  {backendConnected ? 'FastAPI Service Active' : 'FastAPI Offline / Disconnected'}
                </span>
                {lastLatencyMs !== null && (
                  <span className="text-xs font-mono text-[#8B6245]">
                    Latency: {lastLatencyMs} ms
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A3024]">
                {backendConnected
                  ? `Successfully responding at ${apiUrl}/health`
                  : backendError || 'No response detected from target endpoint.'}
              </p>
            </div>
          </div>
        </div>

        {/* Endpoints Contract Reference */}
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-[#2E1E18]">Required Backend Endpoints:</p>
          <div className="p-3 bg-[#F6EBDD]/70 rounded-xl border border-[#E8D2B5] space-y-1.5 font-mono text-[11px] text-[#4A3024]">
            <div className="flex justify-between">
              <span className="text-[#8B6245]">GET /health</span>
              <span>Returns status, backend version</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B6245]">GET /model-info</span>
              <span>Returns Qiskit circuit metadata & features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B6245]">POST /predict</span>
              <span>Accepts V14, V10, V12, V4, V17, V3</span>
            </div>
          </div>
        </div>

        {/* Model Info preview if connected */}
        {modelInfo && (
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[#2E1E18]">Connected Model Information:</p>
            <pre className="p-3 bg-[#FFFDF9] rounded-xl border border-[#E8D2B5] font-mono text-[11px] text-[#4A3024] overflow-x-auto">
              {JSON.stringify(modelInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
};
