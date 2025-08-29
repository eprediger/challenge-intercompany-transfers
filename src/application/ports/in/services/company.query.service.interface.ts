import { Company } from 'src/application/domain/entities/company.entity';
import { DateRange } from 'src/application/domain/value-objects/date-range';
import { PageOptions } from 'src/application/domain/value-objects/page-options';

export interface ICompanyQueryService {
  /**
   * Finds companies that sent transfers within a given date range.
   * @param params The date range with 'from' and 'to' properties.
   * @param page The page object to limit the result
   * @returns An array of companies that sent transfers in the given period.
   */
  findTransferSenders(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]>;

  /**
   * Finds companies that subscribed within a given date range.
   * @param params The date range with 'from' and 'to' properties.
   * @param page The page object to limit the result
   * @returns A page of companies subscribed in the given period.
   */
  findCompaniesSubscribed(
    dateRange: DateRange,
    page: PageOptions,
  ): Promise<[Company[], number]>;
}
