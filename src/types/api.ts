/**
 * Q-FraudX API Data Contracts
 * Defines types for Python FastAPI backend integration.
 */

export interface TransactionFeatureVector {
  V14: number;
  V10: number;
  V12: number;
  V4: number;
  V17: number;
  V3: number;
}

export interface PredictionRequest {
  V14: number;
  V10: number;
  V12: number;
  V4: number;
  V17: number;
  V3: number;
}

export interface SessionTransactionRecord {
  id: string;
  time: string;
  features: TransactionFeatureVector;
  fraud_score: number;
  risk_level: string;
  prediction: string | number;
  status: 'SUCCESS' | 'FLAGGED' | 'CLEARED';
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;

export interface PredictionResponse {
  fraud_score: number;
  risk_level: RiskLevel;
  prediction: number | string;
  quantum_circuit_depth?: number;
  execution_time_ms?: number;
  model_version?: string;
  backend_name?: string;
}

export interface BackendHealthResponse {
  status: string;
  version?: string;
  quantum_backend?: string;
  timestamp?: string;
  message?: string;
}

export interface ModelInfoResponse {
  model_name?: string;
  model_type?: string;
  framework?: string;
  features?: string[];
  qiskit_version?: string;
  qubits_count?: number;
  description?: string;
}

export interface ApiErrorResponse {
  detail?: string | { msg?: string }[];
  message?: string;
  error?: string;
}
