const { getPackageDeps } = require("../shared/read-dependencies");
const {
  findDuplicateDependencies,
  transformDependencies,
} = require("../shared/util");
const classicApi = require("./classic-api");
const berryApi = require("./berry-api");

const checkYarn = ({
  overrides,
  getPackageRoots = classicApi.getWorkspaces,
}) => {
  const workspaces = getPackageRoots();
  return _baseYarnCheck({ workspaces, overrides });
};

const checkBerry = ({
  overrides,
  getPackageRoots = berryApi.getWorkspaces,
}) => {
  const workspaces = getPackageRoots();
  return _baseYarnCheck({ workspaces, overrides });
};

const _baseYarnCheck = ({ workspaces, overrides }) => {
  const packageDeps = workspaces.map(({ path }) => getPackageDeps(path));

  const dependenciesByNameAndVersion = transformDependencies(packageDeps);

  const duplicateDependencies = findDuplicateDependencies(
    dependenciesByNameAndVersion,
    overrides
  );
  return { duplicateDependencies };
};

module.exports = { checkYarn, checkBerry };
