const path = require("path");
const { readFileSync } = require("fs");

/**
 * Read the manifest at a specified path, return only the fields we care about
 */
const getPackageDeps = (packageRoot) => {
  const packageContents = readFileSync(path.join(packageRoot, "package.json"), {
    encoding: "utf8",
  });
  const { name, peerDependencies, devDependencies, dependencies, resolutions } =
    JSON.parse(packageContents);
  return { name, peerDependencies, devDependencies, dependencies, resolutions };
};

module.exports = {
  getPackageDeps,
};
