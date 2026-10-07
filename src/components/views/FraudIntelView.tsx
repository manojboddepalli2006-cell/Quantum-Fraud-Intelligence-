/**
 * FraudIntelView Component
 * Premium Fraud Intelligence Command Center based strictly on REAL CURRENT SESSION DATA.
 * Features:
 * - Fraud vs Legitimate
 * - Low Risk, Medium Risk, High Risk
 * - Average Fraud Score (0.xxx)
 * - High-Risk Transactions
 * - Total Transactions Analyzed
 * - 3D Donut Risk Visualization
 * - Smooth Fraud Score Trend Chart labeled CURRENT SESSION
 * - 3D Quantum Empty State when no session data exists
 */

import React, { useMemo } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Quantum3DDonut } from '../ui/Quantum3DDonut';
import { QuantumSmoothChart } from '../ui/QuantumSmoothChart';
import { QuantumEmptyState } from '../ui/QuantumEmptyState';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Activity,
  Layers,
  ArrowRight,
  PieChart,
  LineChart,
} from 'lucide-react';

interface FraudIntelViewProps {
  onNavigate: (routeId: string) => void;
}

export const FraudIntelView: React.FC<FraudIntelViewProps> = ({ onNavigate }) => {
  const { sessionHistory, sessionMetrics } = useQuantum();

  // Compute session category counts
  const categoryCounts = useMemo(() => {
    let low = 0;
    let med = 0;
    let high = 0;

    sessionHistory.forEach((rec) => {
      const riskUpper = String(rec.risk_level).toUpperCase();
      if (riskUpper.includes('HIGH') || riskUpper.includes('CRITICAL') || rec.fraud_score >= 0.5) {
        high++;
      } else if (riskUpper.includes('MED') || (rec.fraud_score >= 0.2 && rec.fraud_score < 0.5)) {
        med++;
      } else {
        low++;
      }
    });

    const legitimate = sessionHistory.length - sessionMetrics.fraudDetected;

    return {
      low,
      medium: med,
      high,
      legitimate,
      fraud: sessionMetrics.fraudDetected,
      total: sessionHistory.length,
    };
  }, [sessionHistory, sessionMetrics]);

  // If no transactions in session: render official 3D Empty State
  if (sessionHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
            <span>Command Center</span>
            <span aria-hidden="true">·</span>
            <span>Current Session Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
            Fraud Intelligence Command Center
          </h2>
          <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
            Real-time classification telemetry generated strictly from active session transactions.
          </p>
        </div>

        <QuantumEmptyState
          onAction={() => onNavigate('analyzer')}
          actionLabel="Run First Transaction Analysis"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
              Fraud Intelligence Command Center
            </h2>
            <span className="font-mono text-[10px] font-bold text-[#8B6245] bg-[#F6EBDD] px-2 py-0.5 rounded-md">
              CURRENT SESSION
            </span>
          </div>
          <p className="text-xs text-[#8B6245]">
            Aggregated metrics derived exclusively from evaluations recorded in the current session.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => onNavigate('analyzer')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Analyze Another
        </Button>
      </div>

      {/* 1. Core Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Analyzed */}
        <Card variant="surface" rounded="2xl" padding="sm" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8B6245]">
            <span className="font-medium">Total Evaluated</span>
            <Activity className="w-3.5 h-3.5 text-[#B98252]" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#2E1E18] tabular-nums">
            {categoryCounts.total}
          </p>
          <p className="text-[10px] text-[#8B6245] truncate">Current browser session</p>
        </Card>

        {/* Fraud vs Legitimate */}
        <Card variant="surface" rounded="2xl" padding="sm" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8B6245]">
            <span className="font-medium">Fraud vs Legitimate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3D7A5A]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#B83A2E] tabular-nums">
              {categoryCounts.fraud}
            </span>
            <span className="text-xs font-mono text-[#8B6245]">/</span>
            <span className="text-xl font-mono font-bold text-[#3D7A5A] tabular-nums">
              {categoryCounts.legitimate}
            </span>
          </div>
          <p className="text-[10px] text-[#8B6245] truncate">
            {categoryCounts.fraud} flagged · {categoryCounts.legitimate} cleared
          </p>
        </Card>

        {/* Average Fraud Score */}
        <Card variant="surface" rounded="2xl" padding="sm" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8B6245]">
            <span className="font-medium">Average Fraud Score</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#B98252]" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#2E1E18] tabular-nums">
            {sessionMetrics.averageFraudScore !== null
              ? sessionMetrics.averageFraudScore.toFixed(3)
              : '—'}
          </p>
          <p className="text-[10px] text-[#8B6245] truncate">Model score mean</p>
        </Card>

        {/* High-Risk Transactions */}
        <Card variant="surface" rounded="2xl" padding="sm" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8B6245]">
            <span className="font-medium">High-Risk Cases</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#B83A2E]" />
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-[#B83A2E] tabular-nums">
            {categoryCounts.high}
          </p>
          <p className="text-[10px] text-[#8B6245] truncate">Score &ge; 0.50 cutoff</p>
        </Card>

        {/* Risk Breakdown Summary */}
        <Card variant="surface" rounded="2xl" padding="sm" className="space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#8B6245]">
            <span className="font-medium">Risk Tiers</span>
            <Layers className="w-3.5 h-3.5 text-[#B98252]" />
          </div>
          <div className="flex items-center justify-between font-mono text-xs pt-1">
            <span className="text-[#3D7A5A]">Low: {categoryCounts.low}</span>
            <span className="text-[#B98252]">Med: {categoryCounts.medium}</span>
            <span className="text-[#B83A2E]">High: {categoryCounts.high}</span>
          </div>
          <p className="text-[10px] text-[#8B6245] truncate">Current classification pool</p>
        </Card>
      </div>

      {/* 2. Visualizations Grid: 3D Donut + Smooth Score Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Risk Visualization (3D Donut Ring) (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#B98252]" />
                <h3 className="text-base font-semibold text-[#2E1E18]">
                  Risk Tier Distribution
                </h3>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#8B6245]">
                3D RING VIEW
              </span>
            </div>

            <div className="py-2 flex justify-center">
              <Quantum3DDonut
                low={categoryCounts.low}
                medium={categoryCounts.medium}
                high={categoryCounts.high}
                size={210}
              />
            </div>

            {/* Linear Progress Bars for each category */}
            <div className="space-y-2.5 pt-2 border-t border-[#E8D2B5]/60 text-xs">
              {/* Low */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-[#3D7A5A] font-semibold">Low Risk</span>
                  <span className="text-[#2E1E18] tabular-nums">
                    {categoryCounts.low} ({Math.round((categoryCounts.low / categoryCounts.total) * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3D7A5A] rounded-full transition-all duration-500"
                    style={{ width: `${(categoryCounts.low / categoryCounts.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Med */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-[#B98252] font-semibold">Medium Risk</span>
                  <span className="text-[#2E1E18] tabular-nums">
                    {categoryCounts.medium} ({Math.round((categoryCounts.medium / categoryCounts.total) * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B98252] rounded-full transition-all duration-500"
                    style={{ width: `${(categoryCounts.medium / categoryCounts.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* High */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-[#B83A2E] font-semibold">High Risk</span>
                  <span className="text-[#2E1E18] tabular-nums">
                    {categoryCounts.high} ({Math.round((categoryCounts.high / categoryCounts.total) * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B83A2E] rounded-full transition-all duration-500"
                    style={{ width: `${(categoryCounts.high / categoryCounts.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Fraud Score Visualization (Smooth Trend Chart) (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#B98252]" />
                <div>
                  <h3 className="text-base font-semibold text-[#2E1E18]">
                    Fraud Score Trajectory
                  </h3>
                  <p className="text-[11px] text-[#8B6245]">
                    Model score sequence across current session evaluations
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#8B6245] bg-[#F6EBDD] px-2 py-0.5 rounded-md">
                CURRENT SESSION
              </span>
            </div>

            <div className="p-2 bg-[#FFFDF9] rounded-2xl border border-[#E8D2B5]">
              <QuantumSmoothChart records={sessionHistory} height={230} />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8B6245] font-mono">
              <span>Threshold Boundary: 0.500</span>
              <span>Total Points: {sessionHistory.length}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
