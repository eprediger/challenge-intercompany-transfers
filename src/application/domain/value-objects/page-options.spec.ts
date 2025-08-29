import { InvalidPageError } from '../errors/invalid-page.error';
import { PageOptions } from './page-options';

describe('Page', () => {
  it('should be created from page number and take for the amount of elements', () => {
    const expectedPageNumber = 1;
    const expectedPageSize = 10;
    const expectedSkip = 0;

    const page = PageOptions.create(expectedPageNumber, expectedPageSize);

    expect(page.number).toBe(expectedPageNumber);
    expect(page.size).toBe(expectedPageSize);
    expect(page.skip).toBe(expectedSkip);
  });

  describe('should fail for', () => {
    it.each([0, -1])('non-positive page number', (pageNumber: number) => {
      expect(() => PageOptions.create(pageNumber, 10)).toThrow(
        InvalidPageError,
      );
    });

    it.each([0, -1])('non-positive page size', (pageSize: number) => {
      expect(() => PageOptions.create(1, pageSize)).toThrow(InvalidPageError);
    });

    it('page size greater than 50', () => {
      expect(() => PageOptions.create(1, 51)).toThrow(InvalidPageError);
    });
  });

  describe('skip', () => {
    const pageSize = 5;

    it.each([
      { pageNumber: 2, expectedSkip: 5 },
      { pageNumber: 3, expectedSkip: 10 },
      { pageNumber: 4, expectedSkip: 15 },
    ])(
      `should return $expectedSkip for page number $pageNumber of size ${pageSize}`,
      ({ pageNumber, expectedSkip }) => {
        const page = PageOptions.create(pageNumber, pageSize);

        expect(page.skip).toBe(expectedSkip);
      },
    );
  });
});
