import {
  IsInt,
  Max,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';
import { InvalidPageError } from '../errors/invalid-page.error';
import { ErrorDetails } from '../errors/error-details.type';

export class PageOptions {
  private static readonly MINIMUM_PAGE_NUMBER = 1;
  private static readonly MINIMUM_PAGE_SIZE = 1;
  private static readonly MAXIMUM_PAGE_SIZE = 50;

  @IsInt()
  @Min(PageOptions.MINIMUM_PAGE_NUMBER)
  public readonly number: number;

  @IsInt()
  @Min(PageOptions.MINIMUM_PAGE_SIZE)
  @Max(PageOptions.MAXIMUM_PAGE_SIZE)
  public readonly size: number;

  private constructor(number: number, size: number) {
    this.number = number;
    this.size = size;
  }

  /**
   * Creates a new Page instance after validating the page number and size.
   * Throws InvalidPageError if the page number or the page size is not positive.
   *
   * @param number - The page number (must be a positive integer).
   * @param size - The page size (must be a positive integer).
   * @returns A validated Page instance.
   */
  public static create(number: number, size: number) {
    const page = new PageOptions(number, size);
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
