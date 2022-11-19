const {
  findDuplicateDependencies,
  transformDependencies,
} = require("../shared/util");
const { getWorkspaces } = require("./get-workspaces");
const { getPackageDeps } = require("../shared/read-dependencies");

/**
 * TODO
 * pnpm scopes its lockfile to workspaces. Unlike yarn, this means a single
 * dependency specifier can have more than one lockfile entry. This fn needs
 * to be updated to check lockfiles as well (hence why it has been separated
 *  from the yarn api)
 */
const checkPnpm = ({ overrides, getPackageRoots = getWorkspaces }) => {
  const workspaces = getPackageRoots();
  const packageDeps = workspaces.map(({ path }) => getPackageDeps(path));

  const dependenciesByNameAndVersion = transformDependencies(packageDeps);

  const duplicateDependencies = findDuplicateDependencies(
    dependenciesByNameAndVersion,
    overrides
  );
  return { duplicateDependencies };
};

module.exports = { checkPnpm };
