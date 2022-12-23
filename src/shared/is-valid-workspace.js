const { existsSync } = require("fs");
const path = require("path");

/**
 * Validate that a path exists
 */
const isValidWorkspace = (filePath) => {
  if (!filePath) {
    return false;
  } 
  if (existsSync(path.join(filePath, "package.json"))) {
    return true;
  }

  throw new Error(`Invalid workspace: ${filePath}`);
};

module.exports = {isValidWorkspace}