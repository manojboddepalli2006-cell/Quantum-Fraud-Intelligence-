/**
 * AnalyticsView Component
 * Premium Session Analytics Dashboard adhering strictly to Part 3 specifications:
 * - Transaction Timeline
 * - Fraud Score Trend (smooth chart)
 * - Risk Distribution
 * - Prediction Distribution
 * - Recent Analysis Activity
 * - 3D Quantum Empty State if no session data exists
 * - Soft cream surfaces, dark chocolate typography, caramel/gold highlights
 */

import React, { useMemo } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { QuantumSmoothChart } from '../ui/QuantumSmoothChart';
import { QuantumEmptyState } from '../ui/QuantumEmptyState';
import { RiskIndicator } from '../ui/StatusIndicator';
import {
  Clock,
  TrendingUp,
  BarChart3,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface AnalyticsViewProps {
  onNavigate: (routeId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate }) => {
  const { sessionHistory, sessionMetrics } = useQuantum();

  // Compute breakdown statistics
  const stats = useMemo(() => {
    let low = 0;
    let med = 0;
    let high = 0;
    let minScore = Infinity;
    let maxScore = -Infinity;

    sessionHistory.forEach((rec) => {
      if (rec.fraud_score < minScore) minScore = rec.fraud_score;
      if (rec.fraud_score > maxScore) maxScore = rec.fraud_score;

      const riskUpper = String(rec.risk_level).toUpperCase();
      if (riskUpper.includes('HIGH') || riskUpper.includes('CRITICAL') || rec.fraud_score >= 0.5) {
        high++;
      } else if (riskUpper.includes('MED') || (rec.fraud_score >= 0.2 && rec.fraud_score < 0.5)) {
        med++;
      } else {
        low++;
      }
    });

    const total = sessionHistory.length;
    const fraud = sessionMetrics.fraudDetected;
    const legitimate = total - fraud;

    return {
      total,
      low,
      med,
      high,
      fraud,
      legitimate,
      minScore: total > 0 ? minScore : 0,
      maxScore: total > 0 ? maxScore : 0,
    };
  }, [sessionHistory, sessionMetrics]);

  // If no session data, render subtle 3D Quantum Empty State
  if (sessionHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
            <span>Session Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Current Session Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
            Transaction Analytics & Trajectories
          </h2>
          <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
            Examines transaction timelines, distribution curves, and model score variations.
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
              Session Analytics & Trajectories
            </h2>
            <span className="font-mono text-[10px] font-bold text-[#8B6245] bg-[#F6EBDD] px-2 py-0.5 rounded-md">
              CURRENT SESSION
            </span>
          </div>
          <p className="text-xs text-[#8B6245]">
            Real-time analytics and score trends calculated strictly from session evaluations.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => onNavigate('analyzer')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Evaluate Transaction
        </Button>
      </div>

      {/* 1. Fraud Score Trend (Smooth Bézier Chart) */}
      <Card variant="surface" rounded="2xl" padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D2B5]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#B98252]" />
            <div>
              <h3 className="text-base font-semibold text-[#2E1E18]">
                Fraud Score Trend
              </h3>
              <p className="text-xs text-[#8B6245]">
                Sequential variation of model scores across current session evaluations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8B6245]">
            <span>Min: {stats.minScore.toFixed(3)}</span>
            <span aria-hidden="true">·</span>
            <span>Max: {stats.maxScore.toFixed(3)}</span>
            <span aria-hidden="true">·</span>
            <span>Mean: {sessionMetrics.averageFraudScore?.toFixed(3) || '—'}</span>
          </div>
        </div>

        <div className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#E8D2B5]">
          <QuantumSmoothChart records={sessionHistory} height={250} />
        </div>
      </Card>

      {/* 2. Side-by-Side: Risk Distribution & Prediction Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Card */}
        <Card variant="surface" rounded="2xl" padding="md" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B98252]" />
              <h3 className="text-base font-semibold text-[#2E1E18]">
                Risk Distribution
              </h3>
            </div>
            <span className="font-mono text-xs text-[#8B6245] tabular-nums">
              {stats.total} Total
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Low */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#3D7A5A] font-semibold">Low Risk (&lt; 0.20)</span>
                <span className="text-[#2E1E18] tabular-nums">
                  {stats.low} ({Math.round((stats.low / stats.total) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3D7A5A] rounded-full transition-all duration-500"
                  style={{ width: `${(stats.low / stats.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Med */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#B98252] font-semibold">Medium Risk (0.20 - 0.50)</span>
                <span className="text-[#2E1E18] tabular-nums">
                  {stats.med} ({Math.round((stats.med / stats.total) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B98252] rounded-full transition-all duration-500"
                  style={{ width: `${(stats.med / stats.total) * 100}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#B83A2E] font-semibold">High Risk (&ge; 0.50)</span>
                <span className="text-[#2E1E18] tabular-nums">
                  {stats.high} ({Math.round((stats.high / stats.total) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#E8D2B5]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B83A2E] rounded-full transition-all duration-500"
                  style={{ width: `${(stats.high / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Prediction Distribution Card */}
        <Card variant="surface" rounded="2xl" padding="md" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#B98252]" />
              <h3 className="text-base font-semibold text-[#2E1E18]">
                Prediction Distribution
              </h3>
            </div>
            <span className="font-mono text-xs text-[#8B6245]">
              Binary Verdict
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            {/* Legitimate Box */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8D2B5] text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#3D7A5A] mx-auto" />
              <span className="text-xs font-semibold text-[#8B6245] uppercase tracking-wider block">
                Legitimate
              </span>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-[#3D7A5A] tabular-nums">
                {stats.legitimate}
              </p>
              <span className="text-[11px] font-mono text-[#8B6245]">
                {Math.round((stats.legitimate / stats.total) * 100)}% of total
              </span>
            </div>

            {/* Fraud Box */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8D2B5] text-center space-y-1">
              <ShieldAlert className="w-5 h-5 text-[#B83A2E] mx-auto" />
              <span className="text-xs font-semibold text-[#8B6245] uppercase tracking-wider block">
                Fraud Flagged
              </span>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-[#B83A2E] tabular-nums">
                {stats.fraud}
              </p>
              <span className="text-[11px] font-mono text-[#8B6245]">
                {Math.round((stats.fraud / stats.total) * 100)}% of total
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Transaction Timeline & Recent Analysis Activity */}
      <Card variant="surface" rounded="2xl" padding="md" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B98252]" />
            <h3 className="text-base font-semibold text-[#2E1E18]">
              Transaction Timeline & Activity Ledger
            </h3>
          </div>
          <span className="font-mono text-xs text-[#8B6245]">
            Chronological ({sessionHistory.length} events)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E8D2B5] text-[#8B6245] uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Time</th>
                <th className="py-2.5 px-3 font-semibold">Transaction ID</th>
                <th className="py-2.5 px-3 font-semibold">Latent Vector (V14, V4)</th>
                <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                <th className="py-2.5 px-3 font-semibold">Model Score</th>
                <th className="py-2.5 px-3 font-semibold text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D2B5]/60">
              {sessionHistory.map((item) => {
                const isFraud =
                  String(item.prediction).toUpperCase() === '1' ||
                  String(item.prediction).toUpperCase() === 'FRAUD' ||
                  item.fraud_score >= 0.5;

                return (
                  <tr key={item.id} className="hover:bg-[#F6EBDD]/40 transition-colors">
                    <td className="py-3 px-3 text-[#4A3024] tabular-nums">{item.time}</td>
                    <td className="py-3 px-3 font-bold text-[#2E1E18]">{item.id}</td>
                    <td className="py-3 px-3 text-[#8B6245]">
                      V14: {item.features.V14.toFixed(2)} · V4: {item.features.V4.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <RiskIndicator level={item.risk_level} />
                    </td>
                    <td className="py-3 px-3 font-bold text-[#2E1E18] tabular-nums">
                      {item.fraud_score.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-semibold ${
                          isFraud ? 'text-[#B83A2E]' : 'text-[#3D7A5A]'
                        }`}
                      >
                        {String(item.prediction)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
