import type { CartLine } from './types';

export function calculateCartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    if (line.priceOnRequest || line.unitPrice === null) return sum;
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) return sum;
    return sum + line.unitPrice * line.quantity;
  }, 0);
}

export function cartHasEnquiryOnlyItems(lines: CartLine[]): boolean {
  return lines.some((line) => line.priceOnRequest || line.unitPrice === null);
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}
