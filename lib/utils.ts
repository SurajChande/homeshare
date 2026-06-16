import { differenceInCalendarDays, parseISO } from 'date-fns';

export function formatCents(cents: number): string {
  return `₹${(cents / 100).toFixed(2)}`;
}

export function parsePriceToCents(dollars: string): number {
  const parsed = parseFloat(dollars.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

export function rentalDays(startDate: string, endDate: string): number {
  const days = differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;
  return Math.max(days, 1);
}

export function computeTotalCents(
  dailyPriceCents: number,
  depositCents: number,
  startDate: string,
  endDate: string
): number {
  const days = rentalDays(startDate, endDate);
  return dailyPriceCents * days + depositCents;
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
