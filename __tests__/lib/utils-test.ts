import {
  formatCents,
  parsePriceToCents,
  rentalDays,
  computeTotalCents,
  toDateString,
} from '@/lib/utils';

describe('formatCents', () => {
  it('formats zero cents', () => {
    expect(formatCents(0)).toBe('₹0.00');
  });

  it('formats whole rupees', () => {
    expect(formatCents(10000)).toBe('₹100.00');
  });

  it('formats paise correctly', () => {
    expect(formatCents(150)).toBe('₹1.50');
  });

  it('rounds to two decimal places', () => {
    expect(formatCents(1)).toBe('₹0.01');
  });
});

describe('parsePriceToCents', () => {
  it('parses a plain number string', () => {
    expect(parsePriceToCents('100')).toBe(10000);
  });

  it('parses a string with currency symbol', () => {
    expect(parsePriceToCents('₹50')).toBe(5000);
  });

  it('parses a decimal string', () => {
    expect(parsePriceToCents('9.99')).toBe(999);
  });

  it('returns 0 for zero value', () => {
    expect(parsePriceToCents('0')).toBe(0);
  });

  it('returns 0 for a string with only a minus sign', () => {
    expect(parsePriceToCents('-')).toBe(0);
  });

  it('returns 0 for non-numeric string', () => {
    expect(parsePriceToCents('abc')).toBe(0);
  });

  it('strips commas and non-numeric characters', () => {
    expect(parsePriceToCents('1,000')).toBe(100000);
  });
});

describe('rentalDays', () => {
  it('returns 1 for same-day rental', () => {
    expect(rentalDays('2024-01-01', '2024-01-01')).toBe(1);
  });

  it('returns correct count for multi-day rental', () => {
    expect(rentalDays('2024-01-01', '2024-01-05')).toBe(5);
  });

  it('returns at least 1 even if end is before start', () => {
    expect(rentalDays('2024-01-10', '2024-01-05')).toBe(1);
  });

  it('spans across month boundary', () => {
    expect(rentalDays('2024-01-30', '2024-02-02')).toBe(4);
  });
});

describe('computeTotalCents', () => {
  it('computes total for a single day', () => {
    // 1000 per day + 500 deposit × 1 day = 1500
    expect(computeTotalCents(1000, 500, '2024-01-01', '2024-01-01')).toBe(1500);
  });

  it('computes total for multiple days', () => {
    // 1000 per day × 3 days + 500 deposit = 3500
    expect(computeTotalCents(1000, 500, '2024-01-01', '2024-01-03')).toBe(3500);
  });

  it('works with zero deposit', () => {
    expect(computeTotalCents(2000, 0, '2024-01-01', '2024-01-02')).toBe(4000);
  });
});

describe('toDateString', () => {
  it('returns ISO date portion only', () => {
    const date = new Date('2024-06-15T12:30:00.000Z');
    expect(toDateString(date)).toBe('2024-06-15');
  });

  it('returns correct date for start of day', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');
    expect(toDateString(date)).toBe('2024-01-01');
  });
});
