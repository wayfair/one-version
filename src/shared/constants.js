const CONFIG_FILE = "oneversion.config.json";

const LOCKFILES = {
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
};

const DEPENDENCY_TYPES = {
  DIRECT: "direct",
  PEER: "peer",
  DEV: "dev",
};

const UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR =
  "Unable to detect a package manager. Try installing dependencies.";
const FAILED_CHECK_ERROR =
  "More than one version of dependencies found. See above output.";
const NO_CHECK_API_ERROR = `'check' api not supported for package manager:`;

module.exports = {
  CONFIG_FILE,
  LOCKFILES,
  DEPENDENCY_TYPES,
  UNABLE_TO_DETECT_PACKAGE_MANAGER_ERROR,
  FAILED_CHECK_ERROR,
  NO_CHECK_API_ERROR,
};
