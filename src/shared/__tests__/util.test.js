const {
  getPackageDeps,
  transformDependencies,
  findDuplicateDependencies,
  detectPackageManager,
} = require("../util");
const fs = require("fs");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  existsSync: jest.fn(),
}));

const MOCK_TRANSFORMED_DEPENDENCIES = {
  eslint: { "7.0.1": { direct: ["mock-app-a", "mock-app-b", "mock-app-c"] } },
  jest: {
    "^27.2": { direct: ["mock-app-a", "mock-app-c"] },
    "^26.5": { direct: ["mock-app-b"] },
  },
  react: {
    "^17": {
      direct: ["mock-app-a", "mock-app-b", "mock-app-c"],
      peer: ["mock-lib-a"],
    },
  },
  "react-dom": {
    17: { direct: ["mock-app-a", "mock-app-c"], peer: ["mock-lib-a"] },
    16: { direct: ["mock-app-b"] },
  },
  cypress: {
    "^2": { dev: ["mock-app-a", "mock-app-b", "mock-app-c", "mock-lib-a"] },
  },
};

const MOCK_OVERRIDES = {
  jest: {
    "^26.5": ["mock-app-b"],
  },
};

describe("getPackageDeps", () => {
  it("returns dependencies for an app", () => {
    const { name, dependencies, devDependencies } = getPackageDeps(
      "src/__fixtures__/mock-app-a"
    );

    expect(name).toBe("mock-app-a");
    expect(dependencies).toEqual({
      eslint: "7.0.1",
      jest: "^27.2",
      react: "^17",
      "react-dom": "17",
    });
    expect(devDependencies).toEqual({
      cypress: "^2",
    });
  });

  it("returns dependencies for a lib", () => {
    const { name, peerDependencies, devDependencies } = getPackageDeps(
      "src/__fixtures__/mock-lib-a"
    );

    expect(name).toBe("mock-lib-a");
    expect(peerDependencies).toEqual({
      react: "^17",
      "react-dom": "17",
    });
    expect(devDependencies).toEqual({
      cypress: "^2",
    });
  });
});

describe("transformDependencies", () => {
  it("transforms dependencies for an array of entities", () => {
    const manifests = [
      getPackageDeps("src/__fixtures__/mock-app-a"),
      getPackageDeps("src/__fixtures__/mock-app-b"),
      getPackageDeps("src/__fixtures__/mock-app-c"),
      getPackageDeps("src/__fixtures__/mock-lib-a"),
    ];

    const dependenciesByNameAndVersion = transformDependencies(manifests);
    expect(dependenciesByNameAndVersion).toEqual(MOCK_TRANSFORMED_DEPENDENCIES);
  });
});

describe("findDuplicateDependencies", () => {
  it("overrides specified", () => {
    const duplicateDependencies = findDuplicateDependencies(
      MOCK_TRANSFORMED_DEPENDENCIES,
      MOCK_OVERRIDES
    );
    expect(duplicateDependencies).toEqual([
      [
        "react-dom",
        {
          16: { direct: ["mock-app-b"] },
          17: { direct: ["mock-app-a", "mock-app-c"], peer: ["mock-lib-a"] },
        },
      ],
    ]);
  });

  it("no overrides specified", () => {
    const duplicateDependencies = findDuplicateDependencies(
      MOCK_TRANSFORMED_DEPENDENCIES,
      {}
    );
    expect(duplicateDependencies).toEqual([
      [
        "jest",
        {
          "^27.2": { direct: ["mock-app-a", "mock-app-c"] },
          "^26.5": { direct: ["mock-app-b"] },
        },
      ],
      [
        "react-dom",
        {
          16: { direct: ["mock-app-b"] },
          17: { direct: ["mock-app-a", "mock-app-c"], peer: ["mock-lib-a"] },
        },
      ],
    ]);
  });

  it("returns pnpm if pnpm-lock.yml exists", () => {
    // first check for yarn.lock, then pnpm
    fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const packageManager = detectPackageManager();
    expect(packageManager).toBe("pnpm");
  });

  it("returns yarn if yarn.lock exists", () => {
    // first check for yarn.lock, then yarnrc
    fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const packageManager = detectPackageManager();
    expect(packageManager).toBe("yarn");
  });

  it("returns berry if yarn.lock and .yarnrc.yml exist", () => {
    // first check for yarn.lock, then yarnrc
    fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
    const packageManager = detectPackageManager();
    expect(packageManager).toBe("berry");
  });

  it("returns empty if package manager is not detected", () => {
    // first check for yarn.lock, then pnpm
    fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
    const packageManager = detectPackageManager();
    expect(packageManager).toBe("");
  });
});
