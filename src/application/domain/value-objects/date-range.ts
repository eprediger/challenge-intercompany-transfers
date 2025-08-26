import { InvalidDateRange } from '../errors/invalid-date-range.error';

export class DateRange {
  constructor(
    public readonly from: Date,
    public readonly to: Date,
  ) {
    if (this.from > this.to) {
      throw new InvalidDateRange();
    }
  }
}
