/**
 * Quantum Context
 * Manages global quantum visualizer activity state, live backend telemetry,
 * analysis event bus, and current session transaction records.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { QuantumActivityState } from '../types/quantum';
import { BackendHealthResponse, ModelInfoResponse, SessionTransactionRecord } from '../types/api';
import { apiClient } from '../api/client';

export interface SessionMetrics {
  transactionsAnalyzed: number;
  fraudDetected: number;
  averageFraudScore: number | null;
  highRiskTransactions: number;
}

interface QuantumContextType {
  activityState: QuantumActivityState;
  setActivityState: (state: QuantumActivityState) => void;
  triggerStatePulse: (state: 'SUCCESS' | 'ERROR') => void;
  backendConnected: boolean;
  isCheckingHealth: boolean;
  healthData: BackendHealthResponse | null;
  modelInfo: ModelInfoResponse | null;
  lastLatencyMs: number | null;
  backendError: string | null;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  refreshBackendStatus: () => Promise<void>;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;

  // Current Session History & Metrics
  sessionHistory: SessionTransactionRecord[];
  sessionMetrics: SessionMetrics;
  addSessionRecord: (record: Omit<SessionTransactionRecord, 'id' | 'time'>) => void;
  clearSessionHistory: () => void;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export const QuantumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityState, setActivityState] = useState<QuantumActivityState>('IDLE');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<BackendHealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [apiUrl, setApiUrlState] = useState<string>(apiClient.getBaseUrl());
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Current session in-memory history
  const [sessionHistory, setSessionHistory] = useState<SessionTransactionRecord[]>([]);

  const pulseTimeoutRef = useRef<number | null>(null);

  const setApiUrl = useCallback((url: string) => {
    apiClient.setBaseUrl(url);
    setApiUrlState(url);
  }, []);

  const triggerStatePulse = useCallback((state: 'SUCCESS' | 'ERROR') => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    setActivityState(state);
    // After 2.5 seconds, scene manager returns to IDLE; reflect in state
    pulseTimeoutRef.current = window.setTimeout(() => {
      setActivityState('IDLE');
      pulseTimeoutRef.current = null;
    }, 2600);
  }, []);

  const refreshBackendStatus = useCallback(async () => {
    setIsCheckingHealth(true);
    setBackendError(null);
    try {
      const healthResult = await apiClient.checkHealth();
      setHealthData(healthResult.data);
      setLastLatencyMs(healthResult.latencyMs);
      setBackendConnected(true);

      try {
        const modelResult = await apiClient.getModelInfo();
        setModelInfo(modelResult.data);
      } catch {
        // optional endpoint
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backend unreachable';
      setBackendError(msg);
      setBackendConnected(false);
      setHealthData(null);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  const addSessionRecord = useCallback((rec: Omit<SessionTransactionRecord, 'id' | 'time'>) => {
    const newRecord: SessionTransactionRecord = {
      ...rec,
      id: `TX-${Date.now().toString().slice(-6)}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setSessionHistory((prev) => [newRecord, ...prev]);
  }, []);

  const clearSessionHistory = useCallback(() => {
    setSessionHistory([]);
  }, []);

  // Compute session metrics strictly from current frontend session records
  const sessionMetrics = useMemo<SessionMetrics>(() => {
    const total = sessionHistory.length;
    if (total === 0) {
      return {
        transactionsAnalyzed: 0,
        fraudDetected: 0,
        averageFraudScore: null,
        highRiskTransactions: 0,
      };
    }

    let fraudCount = 0;
    let highRiskCount = 0;
    let scoreSum = 0;

    sessionHistory.forEach((item) => {
      scoreSum += item.fraud_score;
      const predStr = String(item.prediction).toUpperCase();
      const riskStr = String(item.risk_level).toUpperCase();

      if (predStr === '1' || predStr === 'FRAUD' || item.fraud_score >= 0.5) {
        fraudCount++;
      }

      if (riskStr.includes('HIGH') || riskStr.includes('CRITICAL') || item.fraud_score >= 0.5) {
        highRiskCount++;
      }
    });

    return {
      transactionsAnalyzed: total,
      fraudDetected: fraudCount,
      averageFraudScore: scoreSum / total,
      highRiskTransactions: highRiskCount,
    };
  }, [sessionHistory]);

  // Initial check on mount
  useEffect(() => {
    refreshBackendStatus();
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [refreshBackendStatus]);

  return (
    <QuantumContext.Provider
      value={{
        activityState,
        setActivityState,
        triggerStatePulse,
        backendConnected,
        isCheckingHealth,
        healthData,
        modelInfo,
        lastLatencyMs,
        backendError,
        apiUrl,
        setApiUrl,
        refreshBackendStatus,
        reducedMotion,
        setReducedMotion,
        sessionHistory,
        sessionMetrics,
        addSessionRecord,
        clearSessionHistory,
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = (): QuantumContextType => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
};
