const { check } = require("../check");
const {
  NO_CHECK_API_ERROR,
  FAILED_CHECK_ERROR,
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
} = require("../shared/constants");

const packageManager = "fake-package-manager";
const otherPackageManager = "other-package-manager";

const mockGetConfig = () => ({
  overrides: {},
  packageManager: otherPackageManager,
});
const mockGetMissingPackageApi = () => {};

describe("one-version: check", () => {
  it("throws if package manager is not supported", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue("");

    expect(() => {
      check({
        getPackageManager: mockDetectPackageManager,
        getConfig: mockGetConfig,
        getCheckApi: mockGetMissingPackageApi,
      });
    }).toThrow(`${UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR}`);
  });

  it("throws if package manager detected does not have check api", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    expect(() => {
      check({
        getPackageManager: mockDetectPackageManager,
        getConfig: mockGetConfig,
        getCheckApi: mockGetMissingPackageApi,
      });
    }).toThrow(`${NO_CHECK_API_ERROR} ${packageManager}`);
  });

  it("calls check api if found for package manager", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({ duplicateDependencies: [] });

    check({
      getPackageManager: mockDetectPackageManager,
      getConfig: mockGetConfig,
      getCheckApi: () => mockCheckApi,
    });

    expect(mockCheckApi).toHaveBeenCalledWith({ overrides: {} });
  });

  it("throws if check api finds duplicate dependencies", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({ duplicateDependencies: ["foo"] });

    expect(() => {
      check({
        getPackageManager: mockDetectPackageManager,
        getConfig: mockGetConfig,
        getCheckApi: () => mockCheckApi,
        prettify: () => {},
      });
    }).toThrow(FAILED_CHECK_ERROR);
  });
});
