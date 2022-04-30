const { checkYarn } = require("../check");

const MOCK_COMPATIBLE_WORKSPACES = [
  {
    name: "mock-app-a",
    path: "src/__fixtures__/mock-app-a",
    private: true,
  },
  {
    name: "mock-app-c",
    path: "src/__fixtures__/mock-app-c",
    private: true,
  },
  {
    name: "mock-lib-a",
    path: "src/__fixtures__/mock-lib-a",
    version: "1.2.0",
  },
];

const MOCK_INCOMPATIBLE_WORKSPACES = [
  {
    name: "mock-app-b",
    path: "src/__fixtures__/mock-app-b",
    private: true,
  },
];

const MOCK_OVERRIDES = {
  jest: {
    "^26.5": ["mock-app-b"],
  },
  "react-dom": {
    16: ["mock-app-b"],
  },
};

describe("yarn: check", () => {
  it("succeeds when only one version exists for each dependency and a config file exists", () => {
    const { duplicateDependencies } = checkYarn({
      overrides: MOCK_OVERRIDES,
      getPackageRoots: () => MOCK_COMPATIBLE_WORKSPACES,
    });

    expect(duplicateDependencies).toEqual([]);
  });

  it("succeeds when only one version exists for each dependency and a config file does not exist", () => {
    const { duplicateDependencies } = checkYarn({
      overrides: {},
      getPackageRoots: () => MOCK_COMPATIBLE_WORKSPACES,
    });
    expect(duplicateDependencies).toEqual([]);
  });

  it("succeeds when multiple versions are allowed by the config file", () => {
    const workspaces = [
      ...MOCK_COMPATIBLE_WORKSPACES,
      ...MOCK_INCOMPATIBLE_WORKSPACES,
    ];

    const { duplicateDependencies } = checkYarn({
      overrides: MOCK_OVERRIDES,
      getPackageRoots: () => workspaces,
    });

    expect(duplicateDependencies).toEqual([]);
  });

  it("fails when multiple versions exist for a dependency", () => {
    const workspaces = [
      ...MOCK_COMPATIBLE_WORKSPACES,
      ...MOCK_INCOMPATIBLE_WORKSPACES,
    ];
    const { duplicateDependencies } = checkYarn({
      overrides: {},
      getPackageRoots: () => workspaces,
    });

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
});
