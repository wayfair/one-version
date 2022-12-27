const { check } = require("../index");
const {
  NO_PACKAGE_MANAGER,
  FAILED_CHECK_ERROR,
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
} = require("../../shared/constants");

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
    }).toThrow(`${NO_PACKAGE_MANAGER} ${packageManager}`);
  });

  it("calls get workspaces with package manager ", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    const mockGetWorkspaces = jest.fn();
    mockGetWorkspaces.mockReturnValue([]);
    const mockGetDuplicateDependencies = jest.fn();
    mockGetDuplicateDependencies.mockReturnValue([]);

    check({
      getPackageManager: mockDetectPackageManager,
      getConfig: mockGetConfig,
      getWorkspaces: mockGetWorkspaces,
      getDuplicateDependencies: mockGetDuplicateDependencies,
    });

    expect(mockGetWorkspaces).toHaveBeenCalledWith(packageManager);
  });

  it("throws if check api finds duplicate dependencies", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    const mockGetWorkspaces = jest.fn();
    mockGetWorkspaces.mockReturnValue([]);

    const mockGetDuplicateDependencies = jest.fn();
    mockGetDuplicateDependencies.mockReturnValue(["foo"]);

    expect(() => {
      check({
        getPackageManager: mockDetectPackageManager,
        getConfig: mockGetConfig,
        prettify: () => {},
        getWorkspaces: mockGetWorkspaces,
        getDuplicateDependencies: mockGetDuplicateDependencies,
      });
    }).toThrow(FAILED_CHECK_ERROR);
  });

  it.only("includes the manifest at -f in the check", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    const mockGetPackageDeps = jest.fn().mockReturnValue({});
    const mockIsValidWorkspace = jest.fn().mockReturnValue(true);
    const mockGetWorkspaces = jest.fn().mockReturnValue([]);

    check({
      file: "some-existent-path",
      getPackageManager: mockDetectPackageManager,
      getConfig: mockGetConfig,
      getDependencies: mockGetPackageDeps,
      getWorkspaces: mockGetWorkspaces,
      validateWorkspace: mockIsValidWorkspace,
    });

    expect(mockGetPackageDeps).toHaveBeenCalledWith("some-existent-path");
  });

  it("throws if -f flag is invalid", () => {
    const mockDetectPackageManager = jest.fn();
    mockDetectPackageManager.mockReturnValue(packageManager);

    expect(() => {
      check({
        file: "non-existent-path",
        getPackageManager: mockDetectPackageManager,
        getConfig: mockGetConfig,
        getCheckApi: mockGetMissingPackageApi,
      });
    }).toThrow("Invalid workspace: non-existent-path");
  });
});
