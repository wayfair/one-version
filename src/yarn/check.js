const {
  getPackageDeps,
  findDuplicateDependencies,
  transformDependencies,
} = require('../shared/util');
const classicApi = require('./classic-api');
const berryApi = require('./berry-api');

const checkYarn = () => {
  return {
    getWorkspaces: classicApi.getWorkspaces,
    check: _baseYarnCheck,
  };
};

const checkBerry = () => {
  return {
    getWorkspaces: berryApi.getWorkspaces,
    check: _baseYarnCheck,
  };
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
