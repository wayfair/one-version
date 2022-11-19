const { DEPENDENCY_TYPES } = require("../shared/constants");
const { v4: uuidv4 } = require("uuid");

/**
 * Turn the manifests into a dependency map
 * Where the keys are generated UUIDs
 *
 * e.g.
 * {
 *  '520ce6e4-864a-4f7d-a1e1-e0e4d0a5c821': {
 *     packageName: '@wayfair/foo',
 *     version: '1.0.0',
 *     consumerName: '@wayfair/bar',
 *     type: 'direct'
 *   }
 * }
 *
 * This map allows us to refer to dependencies by and ID, and easily fetch
 * its information when needed to display. This greatly simplifies the previous
 * logic which handled direct/dev/peer deps separately.
 */
const getDependenciesById = (manifests) => {
  return manifests.reduce(
    (
      acc,
      {
        name: consumerName,
        dependencies = [],
        peerDependencies = [],
        devDependencies = [],
      }
    ) => {
      // create a closure over the dependency type to push onto the acc
      // to avoid repeating this for each callback
      const cb =
        (type) =>
        ([packageName, version]) => {
          acc[uuidv4()] = {
            packageName,
            version,
            type,
            consumerName,
          };
        };

      Object.entries(dependencies).forEach(cb(DEPENDENCY_TYPES.DIRECT));
      Object.entries(peerDependencies).forEach(cb(DEPENDENCY_TYPES.PEER));
      Object.entries(devDependencies).forEach(cb(DEPENDENCY_TYPES.DEV));

      return acc;
    },
    {}
  );
};

/**
 * Creates or updates the version dependencies for a given package
 */
const addOrUpdateVersion = ({ seenVersions, id, version }) => {
  const seenConsumers = seenVersions?.[version] || [];
  const versionConsumers = seenConsumers.concat(id);
  return {
    ...seenVersions,
    [version]: versionConsumers,
  };
};

const getDependenciesByVersion = (dependenciesById) => {
  return Object.entries(dependenciesById).reduce(
    (acc, [depId, { packageName, version }]) => {
      acc[packageName] = addOrUpdateVersion({
        seenVersions: acc[packageName],
        version,
        id: depId,
      });
      return acc;
    },
    {}
  );
};

const removeOverrides = ({ dependenciesById = {}, overrides = {} }) => {
  // If we have overrides, remove them from the dependencies list
  if (Object.keys(overrides).length > 0) {
    return Object.entries(dependenciesById).reduce((acc, [id, dep]) => {
      const versionOverrides = overrides?.[dep.packageName] || {};
      if (
        versionOverrides[dep.version] &&
        versionOverrides[dep.version].includes(dep.consumerName)
      ) {
        return acc;
      }
      acc[id] = dep;
      return acc;
    }, {});
  }

  return dependenciesById;
};

const getPackagesWithMultipleVersions = (packageUsesByVersions) => {
  return Object.entries(packageUsesByVersions).reduce(
    (acc, [packageName, versions]) => {
      if (Object.keys(versions).length > 1) {
        acc[packageName] = versions;
      }
      return acc;
    },
    {}
  );
};

const getRuleViolations = ({ dependenciesById, overrides }) => {
  const filteredDependencies = removeOverrides({ dependenciesById, overrides });
  const dependenciesByVersion = getDependenciesByVersion(filteredDependencies);
  const packagesWithMultipleVersions = getPackagesWithMultipleVersions(
    dependenciesByVersion
  );

  return Object.entries(packagesWithMultipleVersions).map(
    ([package, versions]) => ({ name: package, versions })
  );
};

module.exports = {
  getDependenciesById,
  removeOverrides,
  getDependenciesByVersion,
  getRuleViolations,
  getPackagesWithMultipleVersions,
};
