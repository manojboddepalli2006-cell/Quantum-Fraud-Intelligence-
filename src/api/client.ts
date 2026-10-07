/**
 * Q-FraudX Real FastAPI Backend Client
 * Connects directly to the Python FastAPI backend service.
 * Source of truth: VITE_API_BASE_URL / http://localhost:8000
 */

import {
  BackendHealthResponse,
  ModelInfoResponse,
  PredictionRequest,
  PredictionResponse,
  TransactionFeatureVector,
} from '../types/api';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  /**
   * Health Check: GET /health
   */
  public async checkHealth(): Promise<{ data: BackendHealthResponse; latencyMs: number }> {
    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const latencyMs = Math.round(performance.now() - start);

      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as BackendHealthResponse;
      return { data, latencyMs };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      throw new Error(`Unable to reach FastAPI backend at ${this.baseUrl}/health. Reason: ${message}`);
    }
  }

  /**
   * Model Info: GET /model-info
   */
  public async getModelInfo(): Promise<{ data: ModelInfoResponse; latencyMs: number }> {
    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/model-info`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const latencyMs = Math.round(performance.now() - start);

      if (!response.ok) {
        throw new Error(`Model info returned status ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as ModelInfoResponse;
      return { data, latencyMs };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      throw new Error(`Unable to reach FastAPI backend at ${this.baseUrl}/model-info. Reason: ${message}`);
    }
  }

  /**
   * Prediction Endpoint: POST /predict
   * Payload requires exactly: V14, V10, V12, V4, V17, V3
   */
  public async predict(
    features: TransactionFeatureVector
  ): Promise<{ data: PredictionResponse; latencyMs: number }> {
    const payload: PredictionRequest = {
      V14: Number(features.V14),
      V10: Number(features.V10),
      V12: Number(features.V12),
      V4: Number(features.V4),
      V17: Number(features.V17),
      V3: Number(features.V3),
    };

    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const latencyMs = Math.round(performance.now() - start);

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errJson = await response.json();
          errorDetail = typeof errJson.detail === 'string'
            ? errJson.detail
            : JSON.stringify(errJson.detail || errJson);
        } catch {
          // ignore parsing error
        }
        throw new Error(`Prediction failed (${response.status}): ${errorDetail}`);
      }

      const data = (await response.json()) as PredictionResponse;
      return { data, latencyMs };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      throw new Error(`Backend error on ${this.baseUrl}/predict: ${message}`);
    }
  }
}

export const apiClient = new ApiClient();
