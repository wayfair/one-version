/**
Enforcing only one version of any direct dependency is specified in the repo.
Note: Currently enforces the specifications match exactly, i.e. `^17` != `17`.
*/
const chalk = require('chalk');
const {
  parseConfig,
  detectPackageManager,
  isValidManifest,
} = require('./shared/util');
const { format } = require('./format-output');
const { checkYarn, checkBerry } = require('./yarn/check');
const { checkPnpm } = require('./pnpm/check');
const {
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
  FAILED_CHECK_ERROR,
  NO_CHECK_API_ERROR,
} = require('./shared/constants');

const PACKAGE_MANGER_API = {
  pnpm: checkPnpm,
  yarn: checkYarn,
  berry: checkBerry,
};

const getCheckPackageApi = (packageManager) => {
  return PACKAGE_MANGER_API[packageManager];
};

const check = ({
  file,
  getPackageManager = detectPackageManager,
  getConfig = parseConfig,
  getCheckApi = getCheckPackageApi,
  prettify = format,
} = {}) => {
  const { overrides } = getConfig();

  const packageManager = getPackageManager();
  if (!packageManager) {
    throw new Error(UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR);
  }

  const checkApi = getCheckApi(packageManager);

  if (checkApi) {
    const { getWorkspaces, check } = checkApi();

    const workspaces = isValidManifest(file)
      ? [...getWorkspaces(), { path: file }]
      : getWorkspaces();

    const { duplicateDependencies } = check({
      workspaces,
      overrides,
    });

    if (duplicateDependencies.length > 0) {
      console.log(
        chalk.dim('You shall not pass!\n'),
        chalk.reset(
          '🚫 One Version Rule Failure - found multiple versions of the following dependencies:\n'
        ),
        prettify(duplicateDependencies)
      );

      throw new Error(FAILED_CHECK_ERROR);
    }

    console.log(
      chalk.dim('My preciousss\n'),
      chalk.reset('✨ One Version Rule Success - found no version conflicts!')
    );
  } else {
    throw new Error(`${NO_CHECK_API_ERROR} ${packageManager}`);
  }
};

module.exports = {
  check,
};
