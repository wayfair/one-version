const { getPackageDeps } = require("../read-dependencies");

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
