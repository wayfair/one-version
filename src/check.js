/**
One Version to rule them all, One Version to find them,
One Version to bring them all, and in the darkness bind them.

Enforcing only one version of any direct dependency is specified in the repo.
Note: Currently enforces the specifications match exactly, i.e. `^17` != `17`.
*/
const chalk = require('chalk');
const {parseConfig} = require('./shared/util');
const {format} = require('./format-output');
const {checkYarn} = require('./yarn/check');
const {checkPnpm} = require('./pnpm/check');
const {FAILED_CHECK_ERROR, NO_CHECK_API_ERROR} = require('./shared/constants');

const PACKAGE_MANGER_API = {
  pnpm: checkPnpm,
  yarn: checkYarn,
};

const getCheckPackageApi = (packageManager) => {
  return PACKAGE_MANGER_API[packageManager];
};

const check = ({
  packageManager,
  getConfig = parseConfig,
  getCheckApi = getCheckPackageApi,
  prettify = format,
} = {}) => {
  const checkApi = getCheckApi(packageManager);
  if (checkApi) {
    const {overrides} = getConfig();

    const {duplicateDependencies} = checkApi({
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
