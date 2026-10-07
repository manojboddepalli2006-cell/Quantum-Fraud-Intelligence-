/**
 * Formatting and Math Utilities
 */

export function formatModelScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '—';
  return score.toFixed(3);
}

export function formatLatency(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '—';
  return `${ms.toFixed(0)} ms`;
}

export function truncateAddress(addr: string, chars = 6): string {
  if (!addr) return '';
  if (addr.length <= chars * 2) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}
