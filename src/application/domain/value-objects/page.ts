import {
  IsInt,
  Max,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ErrorDetails, InvalidPageError } from '../errors/invalid-page.error';

export class Page {
  private static readonly MINIMUM_PAGE_NUMBER = 1;
  private static readonly MINIMUM_PAGE_SIZE = 1;
  private static readonly MAXIMUM_PAGE_SIZE = 50;

  @IsInt()
  @Min(Page.MINIMUM_PAGE_NUMBER)
  public readonly number: number;

  @IsInt()
  @Min(Page.MINIMUM_PAGE_SIZE)
  @Max(Page.MAXIMUM_PAGE_SIZE)
  public readonly size: number;

  private constructor(number: number, size: number) {
    this.number = number;
    this.size = size;
  }

  /**
   * Creates a new Page instance after validating the page number and size.
   * Throws InvalidPageNumberError if the page number is not positive.
   * Throws InvalidPageSizeError if the page size is not positive.
   *
   * @param number - The page number (must be a positive integer).
   * @param size - The page size (must be a positive integer).
   * @returns A validated Page instance.
   */
  public static create(number: number, size: number) {
    const page = new Page(number, size);
    const errorDetails = validateSync(page).map(
      (error: ValidationError): ErrorDetails => ({
        field: error.property,
        code: `INVALID_PAGE_${error.property.toUpperCase()}`,
        message: `Page ${error.property} must be positive`,
      }),
    );

    if (errorDetails.length > 0) {
      throw new InvalidPageError(errorDetails);
    }

    return page;
  }

  public get skip(): number {
    return (this.number - 1) * this.size;
  }
}
