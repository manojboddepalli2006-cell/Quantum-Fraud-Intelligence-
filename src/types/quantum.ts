/**
 * Quantum Visualizer & Activity State Types
 */

export type QuantumActivityState = 'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR';

export interface QuantumSceneOptions {
  particleCount?: number;
  nodeCount?: number;
  reducedMotion?: boolean;
  lowPowerMode?: boolean;
}

export interface QuantumSystemTelemetry {
  state: QuantumActivityState;
  lastStateChange: number;
  activeQubits: number;
  coherenceScore: number;
  pulseIntensity: number;
}
