const {check} = require('../check');
const {NO_CHECK_API_ERROR, FAILED_CHECK_ERROR} = require('../shared/constants');

const packageManager = 'fake-package-manager';

const mockGetConfig = () => ({overrides: {}});
const mockGetMissingPackageApi = () => {};

describe('one-version: check', () => {
  it('throws if package manager specified does not have check api', () => {
    expect(() => {
      check({
        packageManager,
        getConfig: mockGetConfig,
        getCheckApi: mockGetMissingPackageApi,
      });
    }).toThrow(`${NO_CHECK_API_ERROR} ${packageManager}`);
  });

  it('calls check api if found for package manager', () => {
    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({duplicateDependencies: []});

    check({
      packageManager,
      getConfig: mockGetConfig,
      getCheckApi: () => mockCheckApi,
    });

    expect(mockCheckApi).toHaveBeenCalledWith({overrides: {}});
  });

  it('throws if check api finds duplicate dependencies', () => {
    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({duplicateDependencies: ['foo']});

    expect(() => {
      check({
        packageManager,
        getConfig: mockGetConfig,
        getCheckApi: () => mockCheckApi,
        prettify: () => {},
      });
    }).toThrow(FAILED_CHECK_ERROR);
  });
});
