import { InvalidDateRange } from '../errors/invalid-date-range.error';
import { DateRange } from './date-range';

describe('DateRange', () => {
  const expectedDateFrom = new Date('2023-03-15T10:30:00.000Z');
  const expectedDateTo = new Date('2024-11-22T18:45:00.000Z');

  it('should be created from two dates', () => {
    const dateRange = new DateRange(expectedDateFrom, expectedDateTo);

    expect(dateRange.from).toBe(expectedDateFrom);
    expect(dateRange.to).toBe(expectedDateTo);
  });

  it('should if from date comes after to date', () => {
    expect(() => {
      new DateRange(expectedDateTo, expectedDateFrom);
    }).toThrow(InvalidDateRange);
  });
});
