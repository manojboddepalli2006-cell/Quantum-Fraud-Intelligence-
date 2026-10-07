/**
 * Hook for executing transaction analysis against the FastAPI backend
 * Automatically orchestrates Quantum Activity State:
 * IDLE -> ANALYZING (during real network request) -> SUCCESS (on response) or ERROR (on failure)
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';
import { useQuantum } from '../context/QuantumContext';
import { PredictionResponse, TransactionFeatureVector } from '../types/api';

export interface UseTransactionAnalysisReturn {
  isAnalyzing: boolean;
  result: PredictionResponse | null;
  latencyMs: number | null;
  error: string | null;
  analyze: (features: TransactionFeatureVector) => Promise<PredictionResponse | null>;
  resetResult: () => void;
}

export function useTransactionAnalysis(): UseTransactionAnalysisReturn {
  const { setActivityState, triggerStatePulse } = useQuantum();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (features: TransactionFeatureVector): Promise<PredictionResponse | null> => {
      setIsAnalyzing(true);
      setError(null);
      // Put 3D visualizer in ANALYZING state for the real request duration
      setActivityState('ANALYZING');

      try {
        const { data, latencyMs: measuredLatency } = await apiClient.predict(features);
        setResult(data);
        setLatencyMs(measuredLatency);
        // Trigger warm gold success pulse
        triggerStatePulse('SUCCESS');
        return data;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Analysis failed';
        setError(msg);
        setResult(null);
        // Trigger subtle warm red error pulse
        triggerStatePulse('ERROR');
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setActivityState, triggerStatePulse]
  );

  const resetResult = useCallback(() => {
    setResult(null);
    setError(null);
    setLatencyMs(null);
    setActivityState('IDLE');
  }, [setActivityState]);

  return {
    isAnalyzing,
    result,
    latencyMs,
    error,
    analyze,
    resetResult,
  };
}
