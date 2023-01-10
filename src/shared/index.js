const { parseConfig } = require("./read-config");
const { getPackageDeps } = require("./read-dependencies");
const { getWorkspacesForPackageManager } = require("./get-workspaces");
const { detectPackageManager } = require("./detect-package-manager");
const { isValidWorkspace } = require("./is-valid-workspace");

module.exports = {
  parseConfig,
  getPackageDeps,
  getWorkspacesForPackageManager,
  detectPackageManager,
  isValidWorkspace,
};
