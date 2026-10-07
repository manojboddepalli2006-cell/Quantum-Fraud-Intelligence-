/**
 * QuantumPipeline Component
 * Visualizes the 6-stage quantum pipeline with elegant 3D nodes:
 * Transaction -> Feature Processing -> Quantum Encoding -> Variational Analysis -> Quantum Measurement -> Risk Engine
 * Responds visually to Quantum Activity State.
 */

import React from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { Card } from '../ui/Card';
import {
  CreditCard,
  SlidersHorizontal,
  Binary,
  Cpu,
  Gauge,
  ShieldCheck,
  ChevronRight,
  ArrowDown,
} from 'lucide-react';

export const QuantumPipeline: React.FC = () => {
  const { activityState } = useQuantum();

  const stages = [
    {
      id: 'tx',
      title: 'Transaction',
      desc: 'Raw stream ingestion',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'features',
      title: 'Feature Processing',
      desc: '6D PCA reduction',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    {
      id: 'encoding',
      title: 'Quantum Encoding',
      desc: 'ZZFeatureMap rotation',
      icon: <Binary className="w-4 h-4" />,
    },
    {
      id: 'variational',
      title: 'Variational Analysis',
      desc: 'RealAmplitudes ansatz',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'measurement',
      title: 'Quantum Measurement',
      desc: 'Pauli-Z expectation',
      icon: <Gauge className="w-4 h-4" />,
    },
    {
      id: 'risk',
      title: 'Risk Engine',
      desc: 'FastAPI boundary verdict',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8D2B5]">
        <div>
          <h3 className="text-base font-semibold text-[#2E1E18]">
            Quantum Execution Pipeline
          </h3>
          <p className="text-xs text-[#8B6245]">
            End-to-end path from PCA feature vectors to authoritative decision boundary
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8B6245]">
          <span className="w-2 h-2 rounded-full bg-[#B98252]" />
          <span>Active Phase: {activityState}</span>
        </div>
      </div>

      {/* Pipeline 3D Node Chain */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const isAnalyzing = activityState === 'ANALYZING';
          return (
            <div
              key={stage.id}
              className={`relative flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-300 ${
                isAnalyzing
                  ? 'bg-gradient-to-b from-[#FFFDF9] to-[#F6EBDD] border-[#B98252] shadow-sm'
                  : 'bg-[#FFFDF9]/90 border-[#E8D2B5] hover:border-[#DCC09B]'
              }`}
            >
              {/* 3D Node Icon Disc */}
              <div
                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 transition-all shadow-[0_4px_10px_rgba(74,48,36,0.08),_inset_0_1px_2px_rgba(255,255,255,0.9)] ${
                  isAnalyzing
                    ? 'bg-gradient-to-br from-[#DFB878] to-[#B98252] text-[#2E1E18] scale-105'
                    : 'bg-gradient-to-br from-[#F6EBDD] to-[#E8D2B5] text-[#4A3024]'
                }`}
              >
                {stage.icon}
                {isAnalyzing && (
                  <span className="absolute -inset-1 rounded-2xl bg-[#C5A46D]/30 animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Title & Description */}
              <span className="text-xs font-semibold text-[#2E1E18] line-clamp-1">
                {stage.title}
              </span>
              <span className="text-[10px] text-[#8B6245] mt-0.5 line-clamp-1">
                {stage.desc}
              </span>

              {/* Step indicator */}
              <span className="mt-2 text-[9px] font-mono font-bold text-[#8B6245]/70">
                0{idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
