const CONFIG_FILE = "oneversion.config.json";

const YARN_LOCK = "yarn.lock";
const PNPM_LOCK = "pnpm-lock.yaml";
const YARN_RC = ".yarnrc.yml";

const DEPENDENCY_TYPES = {
  DIRECT: "direct",
  PEER: "peer",
  DEV: "dev",
};

const UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR =
  "Unable to detect a package manager. Try installing dependencies.";
const FAILED_CHECK_ERROR =
  "More than one version of dependencies found. See above output.";

const NO_PACKAGE_MANAGER = `Package manager is not supported:`;

module.exports = {
  CONFIG_FILE,
  DEPENDENCY_TYPES,
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
  FAILED_CHECK_ERROR,
  NO_PACKAGE_MANAGER,
  YARN_LOCK,
  PNPM_LOCK,
  YARN_RC,
};
