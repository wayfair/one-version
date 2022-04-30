const {
  getPackageDeps,
  findDuplicateDependencies,
  transformDependencies,
} = require("../shared/util");
const { getWorkspaces } = require("./get-workspaces");

const checkYarn = ({ overrides, getPackageRoots = getWorkspaces }) => {
  const workspaces = getPackageRoots();

  const packageDeps = workspaces.map(({ path }) => getPackageDeps(path));

  const dependenciesByNameAndVersion = transformDependencies(packageDeps);

  const duplicateDependencies = findDuplicateDependencies(
    dependenciesByNameAndVersion,
    overrides
  );
  return { duplicateDependencies };
};

module.exports = { checkYarn };
