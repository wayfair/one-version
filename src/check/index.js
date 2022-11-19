/**
Enforcing only one version of any direct dependency is specified in the repo.
Note: Currently enforces the specifications match exactly, i.e. `^17` != `17`.
*/
const chalk = require("chalk");
const {
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
  FAILED_CHECK_ERROR,
} = require("../shared/constants");
const { format } = require("./format-output");

const {
  parseConfig,
  getPackageDeps,
  getWorkspacesForPackageManager,
  detectPackageManager,
} = require("../shared");

const {
  getDependenciesById,
  // getDependenciesByVersion,
  // findDuplicateDependencies,
  getRuleViolations,
} = require("./dependency-util");

const _getDuplicateDependencies = ({ workspaceDependencies, overrides }) => {
  //  console.log(ruleViolations);
  // const d = getDependenciesByVersion(dependenciesById);
  // console.log(d);
  //return findDuplicateDependencies(dependenciesByNameAndVersion, overrides);
};

const check = ({
  getPackageManager = detectPackageManager,
  getConfig = parseConfig,
  prettify = format,
  getWorkspaces = getWorkspacesForPackageManager,
  getDuplicateDependencies = _getDuplicateDependencies,
} = {}) => {
  const { overrides } = getConfig();

  const packageManager = getPackageManager();
  if (!packageManager) {
    throw new Error(UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR);
  }

  const workspaces = getWorkspaces(packageManager);

  const workspaceDependencies = workspaces.map(({ path }) =>
    getPackageDeps(path)
  );

  const dependenciesById = getDependenciesById(workspaceDependencies);

  const duplicateDependencies = getRuleViolations({
    dependenciesById,
    overrides,
  });

  console.log(duplicateDependencies);

  if (duplicateDependencies.length > 0) {
    console.log(
      chalk.dim("You shall not pass!\n"),
      chalk.reset(
        "🚫 One Version Rule Failure - found multiple versions of the following dependencies:\n"
      ),
      prettify(duplicateDependencies, dependenciesById)
    );

    throw new Error(FAILED_CHECK_ERROR);
  }

  console.log(
    chalk.dim("My preciousss\n"),
    chalk.reset("✨ One Version Rule Success - found no version conflicts!")
  );
};

module.exports = {
  check,
};
