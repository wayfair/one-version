const { check } = require("../check");
const {
  NO_CHECK_API_ERROR,
  FAILED_CHECK_ERROR,
} = require("../shared/constants");

const packageManager = "fake-package-manager";
const otherPackageManager = "other-package-manager";

const mockGetConfig = () => ({
  overrides: {},
  packageManager: otherPackageManager,
});
const mockGetMissingPackageApi = () => {};

describe("one-version: check", () => {
  it("throws if package manager specified does not have check api", () => {
    expect(() => {
      check({
        packageManager,
        getConfig: mockGetConfig,
        getCheckApi: mockGetMissingPackageApi,
      });
    }).toThrow(`${NO_CHECK_API_ERROR} ${packageManager}`);
  });

  it("calls check api if found for package manager", () => {
    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({ duplicateDependencies: [] });

    check({
      packageManager,
      getConfig: mockGetConfig,
      getCheckApi: () => mockCheckApi,
    });

    expect(mockCheckApi).toHaveBeenCalledWith({ overrides: {} });
  });

  it("throws if check api finds duplicate dependencies", () => {
    const mockCheckApi = jest.fn();
    mockCheckApi.mockReturnValue({ duplicateDependencies: ["foo"] });

    expect(() => {
      check({
        packageManager,
        getConfig: mockGetConfig,
        getCheckApi: () => mockCheckApi,
        prettify: () => {},
      });
    }).toThrow(FAILED_CHECK_ERROR);
  });

  it("-p, --packageManager flags take precedence over the config value", () => {
    const getCheckApi = jest.fn();

    expect(() => {
      check({
        packageManager,
        getConfig: mockGetConfig,
        getCheckApi,
      });
    }).toThrow(`${NO_CHECK_API_ERROR} ${packageManager}`);

    expect(getCheckApi).toHaveBeenCalledWith(packageManager);
  });

  it("use the config specified package manager if no flag is used", () => {
    const getCheckApi = jest.fn();

    expect(() => {
      check({
        getConfig: mockGetConfig,
        getCheckApi,
      });
    }).toThrow(`${NO_CHECK_API_ERROR} ${otherPackageManager}`);

    expect(getCheckApi).toHaveBeenCalledWith(otherPackageManager);
  });
});
