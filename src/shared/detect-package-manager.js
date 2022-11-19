const { existsSync } = require("fs");
const { YARN_RC, YARN_LOCK, PNPM_LOCK } = require("./constants");

/**
 * Detect the package manager being used by the project
 */
const detectPackageManager = () => {
  if (existsSync(YARN_LOCK)) {
    if (existsSync(YARN_RC)) {
      return "berry";
    }
    return "yarn";
  }
  if (existsSync(PNPM_LOCK)) {
    return "pnpm";
  }
  return "";
};

module.exports = {
  detectPackageManager,
};
