/**
 * QuantumEngineView Component
 * Premium 3D Quantum Laboratory adhering strictly to Part 4 specifications:
 * - Title: Quantum Engine
 * - Subtitle: "Visual representation of the Q-FraudX quantum fraud analysis engine."
 * - 4-Qubit 3D Visualization: Qubit 1, Qubit 2, Qubit 3, Qubit 4 with nodes, orbitals, curves, measurement indicators
 * - Feature Visualization: All six backend features (V14, V10, V12, V4, V17, V3) with the four quantum features highlighted (V14, V17, V10, V12)
 * - 7-Stage Pipeline: Input Features -> Feature Scaling -> Quantum Encoding -> 4-Qubit Quantum Circuit -> Quantum Measurement -> Fraud Score -> Risk Classification
 */

import React from 'react';
import { Card } from '../ui/Card';
import { FourQubitCanvas } from '../quantum/FourQubitCanvas';
import { QuantumStateController } from '../quantum/QuantumStateController';
import {
  Cpu,
  Layers,
  Sparkles,
  Binary,
  Gauge,
  Sliders,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const QuantumEngineView: React.FC = () => {
  const quantumQubits = [
    {
      id: 'Q0',
      label: 'Qubit 1',
      feature: 'V14',
      role: 'Velocity Anomaly Phase',
      basis: '|0⟩ + e^(iθ₁)|1⟩',
      desc: 'Primary rotational qubit encoding extreme negative transaction latency shifts.',
    },
    {
      id: 'Q1',
      label: 'Qubit 2',
      feature: 'V17',
      role: 'Device Fingerprint Phase',
      basis: '|0⟩ + e^(iθ₂)|1⟩',
      desc: 'Entangled via CNOT with Q1 to evaluate simultaneous latent credential drift.',
    },
    {
      id: 'Q2',
      label: 'Qubit 3',
      feature: 'V10',
      role: 'Cardholder Behavior Phase',
      basis: '|0⟩ + e^(iθ₃)|1⟩',
      desc: 'Encodes spatial merchant category divergences and burst transaction rates.',
    },
    {
      id: 'Q3',
      label: 'Qubit 4',
      feature: 'V12',
      role: 'Balance Drawdown Phase',
      basis: '|0⟩ + e^(iθ₄)|1⟩',
      desc: 'Interacts across CNOT gates to map non-linear account liquidity depletion.',
    },
  ];

  const allSixFeatures = [
    { name: 'V14', isQuantum: true, qubit: 'Qubit 1', desc: 'Highest negative separator' },
    { name: 'V17', isQuantum: true, qubit: 'Qubit 2', desc: 'Device divergence vector' },
    { name: 'V10', isQuantum: true, qubit: 'Qubit 3', desc: 'Merchant latent factor' },
    { name: 'V12', isQuantum: true, qubit: 'Qubit 4', desc: 'Liquidity velocity vector' },
    { name: 'V4',  isQuantum: false, qubit: 'Classical Support', desc: 'Volume correlate factor' },
    { name: 'V3',  isQuantum: false, qubit: 'Classical Support', desc: 'Account baseline history' },
  ];

  const pipelineStages = [
    { title: 'Input Features', desc: '6D Continuous Vector', icon: <Sliders className="w-4 h-4" /> },
    { title: 'Feature Scaling', desc: 'Min-Max Normalization', icon: <Layers className="w-4 h-4" /> },
    { title: 'Quantum Encoding', desc: 'ZZFeatureMap Expansion', icon: <Binary className="w-4 h-4" /> },
    { title: '4-Qubit Circuit', desc: 'Variational Ansatz (VQC)', icon: <Cpu className="w-4 h-4" /> },
    { title: 'Quantum Measurement', desc: 'Pauli-Z Expectation', icon: <Gauge className="w-4 h-4" /> },
    { title: 'Fraud Score', desc: 'Continuous Model Score', icon: <TrendingDown className="w-4 h-4" /> },
    { title: 'Risk Classification', desc: 'Boundary Decision Verdict', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
          <span>Quantum Laboratory</span>
          <span aria-hidden="true">·</span>
          <span>4-Qubit Variational Architecture</span>
          <span aria-hidden="true">·</span>
          <span>FastAPI Service</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
          Quantum Engine
        </h2>
        <p className="text-sm text-[#4A3024] max-w-2xl leading-relaxed">
          &ldquo;Visual representation of the Q-FraudX quantum fraud analysis engine.&rdquo;
        </p>
      </div>

      {/* 2. 4-Qubit Interactive 3D Visualization Card */}
      <Card
        variant="elevated"
        rounded="3xl"
        padding="none"
        className="overflow-hidden border-[#DCC09B] shadow-[0_12px_40px_rgba(74,48,36,0.08)] bg-gradient-to-br from-[#FFFDF9] via-[#F6EBDD]/90 to-[#E8D2B5]/50"
      >
        <div className="p-6 sm:p-8 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8D2B5]/80">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2E1E18] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#B98252]" />
              4-Qubit Entangled Variational Circuit
            </h3>
            <p className="text-xs text-[#8B6245]">
              Parameterized Bloch sphere rotations interconnected via entangling CNOT channels
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#8B6245]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DFB878]" />
              Rotational Qubit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B98252]" />
              Entangling Channel
            </span>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <FourQubitCanvas />

        {/* 4 Qubit Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-6 sm:p-8 pt-4 bg-[#FFFDF9]/80 border-t border-[#E8D2B5]">
          {quantumQubits.map((q) => (
            <div
              key={q.id}
              className="p-3.5 rounded-2xl bg-[#F6EBDD]/60 border border-[#E8D2B5] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2E1E18]">{q.label}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#C5A46D]/20 text-[#2E1E18] border border-[#C5A46D]/40">
                  {q.feature}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#8B6245]">{q.role}</p>
              <p className="text-[10px] text-[#4A3024] leading-relaxed">{q.desc}</p>
              <p className="text-[10px] font-mono text-[#B98252] pt-1">{q.basis}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Feature Visualization & Visual Grouping */}
      <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D2B5]">
          <div>
            <h3 className="text-base font-semibold text-[#2E1E18] flex items-center gap-2">
              <Binary className="w-5 h-5 text-[#B98252]" />
              Feature Ingestion & Quantum Mapping
            </h3>
            <p className="text-xs text-[#8B6245]">
              Six backend input features with the four primary quantum-mapped features highlighted
            </p>
          </div>
          <span className="text-xs font-mono text-[#8B6245]">
            4 Quantum · 2 Classical
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSixFeatures.map((f) => {
            return (
              <div
                key={f.name}
                className={`p-4 rounded-2xl border transition-all ${
                  f.isQuantum
                    ? 'bg-gradient-to-br from-[#FFFDF9] to-[#F6EBDD] border-[#B98252] shadow-sm shadow-[#B98252]/10 ring-1 ring-[#C5A46D]/30'
                    : 'bg-[#FFFDF9]/60 border-[#E8D2B5] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-mono font-bold text-[#2E1E18]">
                    {f.name}
                  </span>
                  {f.isQuantum ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#2E1E18] bg-[#DFB878]/30 border border-[#B98252] px-2 py-0.5 rounded-full">
                      <Zap className="w-3 h-3 text-[#B98252]" />
                      QUANTUM FEATURE
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#8B6245] bg-[#F6EBDD] px-2 py-0.5 rounded-full">
                      Classical Support
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono font-medium text-[#B98252] mb-1">
                  {f.qubit}
                </p>
                <p className="text-xs text-[#4A3024]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Complete 7-Stage End-to-End Pipeline */}
      <Card variant="surface" rounded="2xl" padding="md" className="space-y-6">
        <div className="pb-3 border-b border-[#E8D2B5]">
          <h3 className="text-base font-semibold text-[#2E1E18] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B98252]" />
            End-to-End Quantum Architecture Pipeline
          </h3>
          <p className="text-xs text-[#8B6245]">
            Seven distinct mathematical transitions from continuous financial stream to final verdict
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.title}
              className="relative flex flex-col items-center text-center p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8D2B5] shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6EBDD] text-[#8B6245] flex items-center justify-center mb-2 shadow-xs">
                {stage.icon}
              </div>
              <span className="text-xs font-semibold text-[#2E1E18] line-clamp-1">
                {stage.title}
              </span>
              <span className="text-[10px] text-[#8B6245] mt-0.5 line-clamp-1">
                {stage.desc}
              </span>
              <span className="mt-2 text-[9px] font-mono font-bold text-[#B98252]">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. 3D State Controller */}
      <section>
        <QuantumStateController />
      </section>
    </div>
  );
};
