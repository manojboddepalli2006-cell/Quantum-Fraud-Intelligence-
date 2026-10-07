/**
 * OverviewView Component
 * Premium Executive Dashboard adhering strictly to Part 2 specifications:
 * - Hero: Quantum Fraud Intelligence
 * - Subtitle: "Quantum-enhanced transaction intelligence for modern financial security."
 * - Large 3D quantum visualization
 * - Session Metrics (labeled CURRENT SESSION):
 *   Transactions Analyzed, Fraud Detected, Average Fraud Score (0.xxx), High-Risk Transactions
 * - Quantum Pipeline: Transaction -> Feature Processing -> Quantum Encoding -> Variational Analysis -> Quantum Measurement -> Risk Engine
 */

import React from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { OverviewQuantumHero } from '../quantum/OverviewQuantumHero';
import { QuantumPipeline } from '../quantum/QuantumPipeline';
import { SessionHistoryTable } from '../quantum/SessionHistoryTable';
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (routeId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { sessionMetrics, activityState } = useQuantum();

  const metrics = [
    {
      label: 'Transactions Analyzed',
      value: sessionMetrics.transactionsAnalyzed.toString(),
      subtext: 'Evaluated in current session',
      icon: <Activity className="w-4 h-4 text-[#B98252]" />,
      accent: 'text-[#2E1E18]',
    },
    {
      label: 'Fraud Detected',
      value: sessionMetrics.fraudDetected.toString(),
      subtext: 'Flagged by decision boundary',
      icon: <AlertTriangle className="w-4 h-4 text-[#B83A2E]" />,
      accent: sessionMetrics.fraudDetected > 0 ? 'text-[#B83A2E]' : 'text-[#2E1E18]',
    },
    {
      label: 'Average Fraud Score',
      value:
        sessionMetrics.averageFraudScore !== null
          ? sessionMetrics.averageFraudScore.toFixed(3)
          : '—',
      subtext: 'Mean model score (0.000 - 1.000)',
      icon: <TrendingDown className="w-4 h-4 text-[#B98252]" />,
      accent: 'text-[#2E1E18]',
    },
    {
      label: 'High-Risk Transactions',
      value: sessionMetrics.highRiskTransactions.toString(),
      subtext: 'Exceeded critical threshold',
      icon: <ShieldCheck className="w-4 h-4 text-[#B83A2E]" />,
      accent: sessionMetrics.highRiskTransactions > 0 ? 'text-[#B83A2E]' : 'text-[#2E1E18]',
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Hero with Large 3D Quantum Visualization */}
      <section>
        <OverviewQuantumHero />
      </section>

      {/* 2. Session Metrics labeled CURRENT SESSION */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8B6245]">
              Session Intelligence Metrics
            </h2>
            <span className="font-mono text-[10px] font-bold text-[#8B6245] bg-[#F6EBDD] px-2 py-0.5 rounded-md">
              CURRENT SESSION
            </span>
          </div>
          <span className="text-[11px] text-[#8B6245]">
            Based strictly on current frontend session data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card
              key={m.label}
              variant="surface"
              rounded="2xl"
              padding="sm"
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[#8B6245]">
                <span className="font-medium flex items-center gap-2">
                  {m.icon}
                  {m.label}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums tracking-tight ${m.accent}`}>
                  {m.value}
                </p>
                <p className="text-[11px] text-[#8B6245] truncate">
                  {m.subtext}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Quantum Pipeline: Transaction -> Feature Processing -> Quantum Encoding -> Variational Analysis -> Quantum Measurement -> Risk Engine */}
      <section>
        <QuantumPipeline />
      </section>

      {/* 4. Quick Action Call to Action */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#F6EBDD] via-[#FFFDF9] to-[#F6EBDD] border border-[#DCC09B] shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-semibold text-[#2E1E18]">
            Ready to Evaluate a Transaction?
          </h3>
          <p className="text-xs text-[#8B6245]">
            Input continuous PCA variables or audition predefined test scenarios.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => onNavigate('analyzer')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Open Transaction Analyzer
        </Button>
      </section>

      {/* 5. Session History Table */}
      <section>
        <SessionHistoryTable />
      </section>
    </div>
  );
};
