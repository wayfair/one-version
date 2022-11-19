const path = require("path");
const { CONFIG_FILE } = require("./constants");
const { readFileSync, existsSync } = require("fs");

/**
 * Parse a config file if it exists
 */
const parseConfig = (configFilePath = CONFIG_FILE) => {
  const configPath = path.join(process.cwd(), configFilePath);
  const configContents = existsSync(configPath)
    ? readFileSync(configPath, { encoding: "utf-8" })
    : "{}";
  return JSON.parse(configContents);
};

module.exports = {
  parseConfig,
};
