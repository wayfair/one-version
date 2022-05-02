const { readFileSync, existsSync } = require("fs");
const path = require("path");
const { DEPENDENCY_TYPES, CONFIG_FILE } = require("./constants");

/**
 * Parse a config file if it exists
 */
const parseConfig = (configFilePath = CONFIG_FILE) => {
  const configPath = path.join(process.cwd(), configFilePath);
  const configContents = existsSync(configPath)
    ? readFileSync(configPath, { encoding: "utf-8" })
    : "{}";
  return JSON.parse(configContents);
};

/**
 * Read the manifest at a specified path, return only the fields we care about
 */
const getPackageDeps = (packageRoot) => {
  const packageContents = readFileSync(path.join(packageRoot, "package.json"), {
    encoding: "utf8",
  });
  const { name, peerDependencies, devDependencies, dependencies } =
    JSON.parse(packageContents);
  return { name, peerDependencies, devDependencies, dependencies };
};

/**
 * Creates or updates the version dependencies for a given package
 */
const addOrUpdateVersion = ({ seenVersions, type, version, consumerName }) => {
  const seenConsumers = seenVersions?.[version]?.[type] || [];
  const versionConsumers = seenConsumers.concat(consumerName);
  return {
    ...seenVersions,
    [version]: {
      ...seenVersions?.[version],
      [type]: versionConsumers,
    },
  };
};

/**
Transform dependencies from an array of package json formats, i.e. multiple
{
  name: "packageName",
  dependencies: {
    'react': '^18'
  }
}
into an inverted structure organized by each dependency name, version, and type:
{
  react: {
    '^18': {direct: [ 'packageName' ], peer: ['demo-package']},
    '^17': {direct: [ 'demo', 'platform-capabilities' ]}
  },
}
that is,
{
   dependencyName: {
     versionSpecifier: {dependencyType: [ consumers using this specifier and type ]}
   }
}
*/
const transformDependencies = (manifests) => {
  return manifests.reduce(
    (
      acc,
      { name: consumerName, dependencies, peerDependencies, devDependencies }
    ) => {
      if (dependencies) {
        Object.entries(dependencies).forEach(([packageName, version]) => {
          acc[packageName] = addOrUpdateVersion({
            seenVersions: acc[packageName],
            type: DEPENDENCY_TYPES.DIRECT,
            version,
            consumerName,
          });
        });
      }
      if (peerDependencies) {
        Object.entries(peerDependencies).forEach(([packageName, version]) => {
          acc[packageName] = addOrUpdateVersion({
            seenVersions: acc[packageName],
            type: DEPENDENCY_TYPES.PEER,
            version,
            consumerName,
          });
        });
      }
      if (devDependencies) {
        Object.entries(devDependencies).forEach(([packageName, version]) => {
          acc[packageName] = addOrUpdateVersion({
            seenVersions: acc[packageName],
            type: DEPENDENCY_TYPES.DEV,
            version,
            consumerName,
          });
        });
      }
      return acc;
    },
    {}
  );
};

/**
 * Removes overridden dependencies from the versions arrays
 */
const removeOverriddenDependencies = ({ packageOverrides, versions }) => {
  return Object.entries(versions)
    .map(([version, { direct, peer, dev }]) => {
      const filteredPackages = {};
      const notOverridden = (packageName) =>
        !packageOverrides[version]?.includes(packageName);
      if (direct) {
        const directDependencies = direct.filter(notOverridden);
        if (directDependencies.length > 0) {
          filteredPackages[DEPENDENCY_TYPES.DIRECT] = directDependencies;
        }
      }
      if (peer) {
        const peerDependencies = peer.filter(notOverridden);
        if (peerDependencies.length > 0) {
          filteredPackages[DEPENDENCY_TYPES.PEER] = peerDependencies;
        }
      }
      if (dev) {
        const devDependencies = dev.filter(notOverridden);
        if (devDependencies.length > 0) {
          filteredPackages[DEPENDENCY_TYPES.DEV] = devDependencies;
        }
      }
      return [version, filteredPackages];
    })
    .filter(([, dependents]) => Object.keys(dependents).length > 0);
};

/**
 * Finds dependencies with multiple versions (excluding overrides)
 */
const findDuplicateDependencies = (dependencies, overrides) => {
  return Object.entries(dependencies)
    .map(([packageName, versions]) => {
      const packageOverrides = overrides?.[packageName];
      if (packageOverrides) {
        const filteredVersions = removeOverriddenDependencies({
          packageOverrides,
          versions,
        });
        return [packageName, Object.fromEntries(filteredVersions)];
      }
      return [packageName, versions];
    })
    .filter(([, versions]) => Object.keys(versions).length > 1);
};

module.exports = {
  parseConfig,
  getPackageDeps,
  transformDependencies,
  findDuplicateDependencies,
};
