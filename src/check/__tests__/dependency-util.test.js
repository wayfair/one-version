const {
  removeOverrides,
  getPackagesWithMultipleVersions,
  getDependenciesById,
  getDependenciesByVersion,
  getRuleViolations,
} = require("../dependency-util");

const dependenciesById = {
  uno: {
    packageName: "A",
    version: "1.0.0",
    type: "direct",
    consumerName: "foo",
  },
  dos: {
    packageName: "B",
    version: "2.0.0",
    type: "peer",
    consumerName: "bar",
  },
  tres: {
    packageName: "C",
    version: "3.0.0",
    type: "dev",
    consumerName: "bar",
  },
  quatro: {
    packageName: "C",
    version: "4.0.0",
    type: "dev",
    consumerName: "bar",
  },
};

describe("getPackagesWithMultipleVersions", () => {
  it("returns only packages with multiple versions", () => {
    const filtered = getPackagesWithMultipleVersions({
      eslint: { "7.0.1": ["a"] }, // this will be filtered out
      jest: {
        "^27.2": ["b"],
        "^26.5": ["c"],
      },
    });

    expect(filtered).toEqual({
      jest: {
        "^27.2": ["b"],
        "^26.5": ["c"],
      },
    });
  });
});

describe("removeOverrides", () => {
  it("removes specified overrides", () => {
    const dependenciesById = {
      a: { packageName: "foo", version: "1.0.0", consumerName: "bar" },
      b: { packageName: "foo", version: "1.0.0", consumerName: "fizz" },
    };
    const overrides = {
      foo: { "1.0.0": ["bar"] },
    };

    const updated = removeOverrides({ dependenciesById, overrides });
    expect(updated).toEqual({
      b: { packageName: "foo", version: "1.0.0", consumerName: "fizz" },
    });
  });

  it("Does not fail when args not passed", () => {
    const updated = removeOverrides();
    expect(updated).toEqual({});
  });
});

describe("getDependenciesById", () => {
  it("Creates a dependency for each specified in the manifests", () => {
    const manifests = [
      { name: "foo", dependencies: { A: "1.0.0" } },
      {
        name: "bar",
        peerDependencies: { B: "2.0.0" },
        devDependencies: { C: "3.0.0" },
      },
    ];

    const dependenciesById = getDependenciesById(manifests);

    expect(Object.values(dependenciesById)).toEqual(
      expect.arrayContaining([
        {
          packageName: "A",
          version: "1.0.0",
          type: "direct",
          consumerName: "foo",
        },
        {
          packageName: "B",
          version: "2.0.0",
          type: "peer",
          consumerName: "bar",
        },
        {
          packageName: "C",
          version: "3.0.0",
          type: "dev",
          consumerName: "bar",
        },
      ])
    );
  });
});

describe("getDependenciesByVersion", () => {
  it("transforms dependencies by id into dependencies by version", () => {
    const dependenciesByVersion = getDependenciesByVersion(dependenciesById);

    expect(dependenciesByVersion).toEqual({
      A: { "1.0.0": ["uno"] },
      B: { "2.0.0": ["dos"] },
      C: { "3.0.0": ["tres"], "4.0.0": ["quatro"] },
    });
  });
});

describe("getRuleViolations", () => {
  it("combines everything and returns violating deps", () => {
    const violations = getRuleViolations({ dependenciesById, overrides: {} });

    expect(violations).toEqual([
      { name: "C", versions: { "3.0.0": ["tres"], "4.0.0": ["quatro"] } },
    ]);
  });

  it("respects overrides", () => {
    const violations = getRuleViolations({
      dependenciesById,
      overrides: { C: { "4.0.0": ["bar"] } },
    });

    expect(violations).toEqual([]);
  });
});
