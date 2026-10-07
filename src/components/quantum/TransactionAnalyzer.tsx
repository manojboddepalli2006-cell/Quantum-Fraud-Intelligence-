/**
 * TransactionAnalyzer Component
 * Premium Quantum Transaction Analyzer for Q-FraudX.
 * Adheres strictly to Part 2 specifications:
 * - Exactly six input fields: V14, V10, V12, V4, V17, V3 (supports +/- decimals)
 * - Sample scenarios (LOW RISK, MEDIUM RISK, HIGH RISK) with disclaimer
 * - Real API: POST `${VITE_API_BASE_URL}/predict` sending ONLY the 6 fields
 * - Visual loading sequence (Feature Preprocessing -> Quantum Encoding -> Variational Analysis -> Quantum Measurement -> Risk Engine)
 * - Result display with animated 3D circular gauge, PREDICTION, RISK LEVEL, FRAUD SCORE (0.xxx model score)
 * - Error handling with "Quantum Analysis Unavailable", "Unable to connect to the Q-FraudX backend.", Retry
 * - Appends to CURRENT SESSION history
 */

import React, { useState, useEffect } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { apiClient } from '../../api/client';
import { TransactionFeatureVector, PredictionResponse } from '../../types/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Quantum3DGauge } from '../ui/Quantum3DGauge';
import { RiskIndicator } from '../ui/StatusIndicator';
import { SessionHistoryTable } from './SessionHistoryTable';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'low',
    label: 'LOW RISK',
    features: { V14: -0.31, V10: -0.12, V12: 0.15, V4: 0.45, V17: 0.20, V3: 1.10 },
  },
  {
    id: 'med',
    label: 'MEDIUM RISK',
    features: { V14: -1.95, V10: -1.45, V12: -1.80, V4: 1.95, V17: -1.30, V3: -0.85 },
  },
  {
    id: 'high',
    label: 'HIGH RISK',
    features: { V14: -4.85, V10: -3.20, V12: -3.90, V4: 3.80, V17: -2.95, V3: -2.15 },
  },
];

const ANALYSIS_STAGES = [
  'Feature Preprocessing',
  'Quantum Encoding',
  'Variational Analysis',
  'Quantum Measurement',
  'Risk Engine',
];

export const TransactionAnalyzer: React.FC = () => {
  const {
    apiUrl,
    setActivityState,
    triggerStatePulse,
    addSessionRecord,
  } = useQuantum();

  // Exactly six input fields
  const [fields, setFields] = useState<Record<keyof TransactionFeatureVector, string>>({
    V14: '-0.31',
    V10: '-0.12',
    V12: '0.15',
    V4: '0.45',
    V17: '0.20',
    V3: '1.10',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof TransactionFeatureVector, string>>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState(0);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cycle through visual loading experience during analysis
  useEffect(() => {
    let interval: number;
    if (isAnalyzing) {
      setAnalysisStageIndex(0);
      interval = window.setInterval(() => {
        setAnalysisStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInputChange = (key: keyof TransactionFeatureVector, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));

    // Validate numeric decimal
    if (value.trim() === '') {
      setFieldErrors((prev) => ({ ...prev, [key]: 'Value is required' }));
    } else if (isNaN(Number(value))) {
      setFieldErrors((prev) => ({ ...prev, [key]: 'Must be a valid decimal number' }));
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleApplyScenario = (scenario: typeof SCENARIOS[0]) => {
    setFields({
      V14: String(scenario.features.V14),
      V10: String(scenario.features.V10),
      V12: String(scenario.features.V12),
      V4: String(scenario.features.V4),
      V17: String(scenario.features.V17),
      V3: String(scenario.features.V3),
    });
    setFieldErrors({});
    setErrorMsg(null);
  };

  const validateAll = (): TransactionFeatureVector | null => {
    const errors: Partial<Record<keyof TransactionFeatureVector, string>> = {};
    const keys: (keyof TransactionFeatureVector)[] = ['V14', 'V10', 'V12', 'V4', 'V17', 'V3'];

    const values: Partial<TransactionFeatureVector> = {};

    keys.forEach((k) => {
      const raw = fields[k].trim();
      if (!raw) {
        errors[k] = 'Required';
      } else {
        const num = Number(raw);
        if (isNaN(num)) {
          errors[k] = 'Invalid decimal';
        } else {
          values[k] = num;
        }
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return values as TransactionFeatureVector;
  };

  const handleAnalyze = async () => {
    const validVector = validateAll();
    if (!validVector) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    // 1. Set Quantum Activity to ANALYZING
    setActivityState('ANALYZING');

    try {
      // 2. Call real POST /predict with exact keys
      const response = await apiClient.predict(validVector);

      // 3. Store result & latency
      setResult(response.data);
      setLatencyMs(response.latencyMs);

      // 4. Append to CURRENT SESSION history
      const pred = response.data.prediction;
      const isFlagged =
        String(pred).toUpperCase() === '1' ||
        String(pred).toUpperCase() === 'FRAUD' ||
        response.data.fraud_score >= 0.5;

      addSessionRecord({
        features: validVector,
        fraud_score: response.data.fraud_score,
        risk_level: response.data.risk_level,
        prediction: pred,
        status: isFlagged ? 'FLAGGED' : 'CLEARED',
      });

      // 5. Set Quantum Activity to SUCCESS (warm gold pulse)
      triggerStatePulse('SUCCESS');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network failure';
      setErrorMsg(msg);
      // 6. Set Quantum Activity to ERROR
      triggerStatePulse('ERROR');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFields({
      V14: '-0.31',
      V10: '-0.12',
      V12: '0.15',
      V4: '0.45',
      V17: '0.20',
      V3: '1.10',
    });
    setFieldErrors({});
    setResult(null);
    setErrorMsg(null);
    setLatencyMs(null);
    setActivityState('IDLE');
  };

  return (
    <div className="space-y-10">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
          Quantum Transaction Analyzer
        </h2>
        <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
          &ldquo;Analyze transaction behavior through Q-FraudX&rsquo;s quantum fraud engine.&rdquo;
        </p>
      </div>

      {/* Main Grid: Inputs (7 cols) + Evaluation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exactly 6 Feature Fields */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
            {/* Header & Sample Scenarios */}
            <div className="space-y-3 pb-4 border-b border-[#E8D2B5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#2E1E18]">
                    Quantum Feature Inputs (6 Dimensions)
                  </h3>
                  <p className="text-xs text-[#8B6245]">
                    Supports positive and negative continuous decimals
                  </p>
                </div>

                {/* Scenario Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F6EBDD] rounded-xl self-start sm:self-auto">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => handleApplyScenario(sc)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg text-[#4A3024] hover:text-[#2E1E18] hover:bg-[#FFFDF9] transition-all cursor-pointer"
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Scenarios Mandatory Disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-[#8B6245] bg-[#F6EBDD]/60 px-3 py-1.5 rounded-xl border border-[#E8D2B5]">
                <Info className="w-3.5 h-3.5 text-[#B98252] shrink-0" />
                <span>
                  Sample scenarios — not real transactions. These only populate the input fields. The backend determines the actual result.
                </span>
              </div>
            </div>

            {/* Exactly 6 Input Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(['V14', 'V10', 'V12', 'V4', 'V17', 'V3'] as const).map((key) => (
                <div key={key} className="space-y-1">
                  <Input
                    label={key}
                    type="text"
                    inputMode="decimal"
                    value={fields[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    error={fieldErrors[key]}
                    helperText={
                      key === 'V14'
                        ? 'Velocity separator'
                        : key === 'V4'
                        ? 'Volume correlate'
                        : 'Latent dimension'
                    }
                  />
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8D2B5]/60">
              <span className="text-xs font-mono text-[#8B6245] truncate">
                Target: {apiUrl}/predict
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  disabled={isAnalyzing}
                >
                  Reset
                </Button>

                <Button
                  variant="gold"
                  size="md"
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                  className="w-full sm:w-auto"
                >
                  Analyze Transaction
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Loading Animation or Results or Error */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            variant="elevated"
            rounded="2xl"
            padding="md"
            className="space-y-6 border-[#DCC09B]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
              <h3 className="text-base font-semibold text-[#2E1E18]">
                Quantum Evaluation Verdict
              </h3>
              {latencyMs !== null && !isAnalyzing && (
                <span className="text-xs font-mono text-[#8B6245] tabular-nums">
                  Roundtrip: {latencyMs} ms
                </span>
              )}
            </div>

            {/* State 1: Visual Loading Experience */}
            {isAnalyzing ? (
              <div className="py-8 space-y-6 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-3 border-[#C5A46D]/30 border-t-[#B98252] animate-spin" />
                  <Cpu className="w-6 h-6 text-[#B98252] absolute inset-0 m-auto" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#B98252]">
                    Transmitting to Quantum Circuit
                  </p>
                  <p className="text-base font-semibold text-[#2E1E18]">
                    {ANALYSIS_STAGES[analysisStageIndex]}
                  </p>
                  <p className="text-[11px] text-[#8B6245]">
                    Visual loading experience · POST /predict
                  </p>
                </div>

                {/* Loading Stepper */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {ANALYSIS_STAGES.map((stage, idx) => (
                    <span
                      key={stage}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === analysisStageIndex
                          ? 'w-6 bg-[#B98252]'
                          : idx < analysisStageIndex
                          ? 'w-2 bg-[#DCC09B]'
                          : 'w-2 bg-[#E8D2B5]/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : errorMsg ? (
              /* State 2: Error Handling with Retry (never fake a result) */
              <div className="p-5 rounded-2xl bg-[#FAECE8] border border-[#B83A2E]/30 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#B83A2E] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#B83A2E]">
                      Quantum Analysis Unavailable
                    </h4>
                    <p className="text-xs text-[#4A3024] leading-relaxed">
                      Unable to connect to the Q-FraudX backend.
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
                    onClick={handleAnalyze}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : result ? (
              /* State 3: Real Backend Result Display */
              <div className="space-y-6">
                {/* 3D Circular Gauge */}
                <Quantum3DGauge
                  score={result.fraud_score}
                  riskLevel={result.risk_level}
                />

                {/* Required Fields: PREDICTION, RISK LEVEL, FRAUD SCORE */}
                <div className="p-4 rounded-2xl bg-[#F6EBDD]/60 border border-[#E8D2B5] space-y-3">
                  {/* FRAUD SCORE (Rule: Model score, never probability) */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8B6245] uppercase tracking-wider">
                      Fraud Score
                    </span>
                    <span className="font-mono text-base font-bold text-[#2E1E18] tabular-nums">
                      {result.fraud_score.toFixed(3)}
                    </span>
                  </div>

                  {/* RISK LEVEL */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8D2B5]/60">
                    <span className="font-semibold text-[#8B6245] uppercase tracking-wider">
                      Risk Level
                    </span>
                    <RiskIndicator level={result.risk_level} />
                  </div>

                  {/* PREDICTION */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8D2B5]/60">
                    <span className="font-semibold text-[#8B6245] uppercase tracking-wider">
                      Prediction
                    </span>
                    <span className="font-mono font-bold text-[#2E1E18]">
                      {String(result.prediction)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#8B6245]">
                  <span>Evaluator: FastAPI (/predict)</span>
                  <span className="text-[#3D7A5A] font-semibold">Authoritative</span>
                </div>
              </div>
            ) : (
              /* State 4: Initial Empty State */
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F6EBDD] flex items-center justify-center mx-auto text-[#8B6245]">
                  <Sliders className="w-6 h-6 text-[#B98252]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#2E1E18]">Awaiting Evaluation</p>
                  <p className="text-xs text-[#8B6245] max-w-xs mx-auto">
                    Select a scenario or adjust the 6 continuous variables, then click Analyze Transaction.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Session History Table for CURRENT SESSION */}
      <section>
        <SessionHistoryTable />
      </section>
    </div>
  );
};
