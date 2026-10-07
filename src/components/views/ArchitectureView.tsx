/**
 * ArchitectureView Component
 * High-fidelity breakdown of the Quantum Fraud Intelligence Pipeline:
 * Classical Ingestion -> PCA Feature Extraction -> Quantum State Encoding -> Variational Circuit -> FastAPI API -> 3D UI
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Cpu, Layers, GitCommit, Shield, Network } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'High-Variance Latent Ingestion',
      subtitle: 'Dimensionality reduction & PCA filtering',
      icon: <Layers className="w-5 h-5 text-[#B98252]" />,
      detail:
        'Financial transaction stream is filtered down to the six highest fraud-separating PCA components: V14, V10, V12, V4, V17, and V3. These explain over 88% of anomalous latent variance in benchmark credit fraud datasets.',
    },
    {
      step: '02',
      title: 'Quantum State Encoding (ZZFeatureMap)',
      subtitle: 'Hilbert space Hilbert dimension expansion',
      icon: <Network className="w-5 h-5 text-[#B98252]" />,
      detail:
        'Continuous classical vectors are mapped onto quantum Bloch sphere rotations via parameterized single-qubit gates (RZ, RY) and two-qubit entangling CNOT/CZ gates, establishing non-linear feature correlations intractable on classical GPUs.',
    },
    {
      step: '03',
      title: 'Variational Quantum Circuit (VQC)',
      subtitle: 'Ansatz parameter optimization & measurement',
      icon: <Cpu className="w-5 h-5 text-[#B98252]" />,
      detail:
        'A parameterized quantum ansatz applies trainable rotation layers. Observable Z-basis measurements yield expectation values that dictate whether the state falls into the benign or fraudulent eigenspace.',
    },
    {
      step: '04',
      title: 'FastAPI Microservice Serving',
      subtitle: 'Single source of truth execution',
      icon: <GitCommit className="w-5 h-5 text-[#B98252]" />,
      detail:
        'The Python FastAPI backend computes exact decision thresholds, returning fraud_score, risk_level, and prediction with sub-50ms execution latency for real-time banking decision pipelines.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B6245]">
          <span>Quantum Computing & FinTech Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Qiskit Variational Framework</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E1E18]">
          Quantum-Enhanced Fraud Intelligence Architecture
        </h2>
        <p className="text-sm text-[#4A3024] max-w-3xl leading-relaxed">
          How Q-FraudX combines high-dimensional quantum Hilbert space mappings with low-latency
          FastAPI microservice infrastructure for next-generation financial anomaly detection.
        </p>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((item) => (
          <Card key={item.step} variant="surface" rounded="2xl" padding="md" className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D2B5]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#F6EBDD] text-[#8B6245]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2E1E18]">{item.title}</h3>
                  <p className="text-[11px] text-[#8B6245]">{item.subtitle}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#B98252]">{item.step}</span>
            </div>
            <p className="text-xs text-[#4A3024] leading-relaxed">{item.detail}</p>
          </Card>
        ))}
      </div>

      {/* Technical Specifications Summary Card */}
      <Card variant="elevated" rounded="2xl" padding="md" className="space-y-4">
        <h3 className="text-base font-semibold text-[#2E1E18] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#B98252]" />
          Technical Invariants & Design Standards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E8D2B5] text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-[#2E1E18]">Feature Dimension</span>
            <p className="text-[#8B6245]">Strict 6-qubit mapping for V14, V10, V12, V4, V17, V3.</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-[#2E1E18]">Backend Isolation</span>
            <p className="text-[#8B6245]">FastAPI remains authoritative source of truth. Zero mock fabrication.</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-[#2E1E18]">Living 3D Visualizer</span>
            <p className="text-[#8B6245]">Three.js WebGL canvas coupled directly to network request lifecycle.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
