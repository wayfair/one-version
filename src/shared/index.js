const { parseConfig } = require("./read-config");
const { getPackageDeps } = require("./read-dependencies");
const { getWorkspacesForPackageManager } = require("./get-workspaces");
const { detectPackageManager } = require("./detect-package-manager");

module.exports = {
	parseConfig,
	getPackageDeps,
	getWorkspacesForPackageManager,
	detectPackageManager,
};
