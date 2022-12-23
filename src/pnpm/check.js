const {
  getPackageDeps,
  findDuplicateDependencies,
  transformDependencies,
} = require('../shared/util');
const { getWorkspaces } = require('./get-workspaces');

/**
 * TODO
 * pnpm scopes its lockfile to workspaces. Unlike yarn, this means a single
 * dependency specifier can have more than one lockfile entry. This fn needs
 * to be updated to check lockfiles as well (hence why it has been separated
 *  from the yarn api)
 */
const checkPnpm = () => {
  return {
    getWorkspaces,
    check: _basePnpmCheck,
  };
};

const _basePnpmCheck = ({ overrides, workspaces }) => {
  const packageDeps = workspaces.map(({ path }) => getPackageDeps(path));

  const dependenciesByNameAndVersion = transformDependencies(packageDeps);

  const duplicateDependencies = findDuplicateDependencies(
    dependenciesByNameAndVersion,
    overrides
  );
  return { duplicateDependencies };
};

module.exports = { checkPnpm };
