const CONFIG_FILE = "oneversion.config.json";

const DEPENDENCY_TYPES = {
  DIRECT: "direct",
  PEER: "peer",
  DEV: "dev",
};

const FAILED_CHECK_ERROR =
  "More than one version of dependencies found. See above output.";
const NO_CHECK_API_ERROR = `'check' api not supported for package manager:`;

module.exports = {
  CONFIG_FILE,
  DEPENDENCY_TYPES,
  FAILED_CHECK_ERROR,
  NO_CHECK_API_ERROR,
};
