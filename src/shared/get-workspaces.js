const cp = require("child_process");
const path = require("path");
const { NO_PACKAGE_MANAGER } = require("./constants");

const _getWorkspacesPNPM = ({ execSync = cp.execSync } = {}) => {
  /**
   * @type {Array<{
   *   name: string;
   *   path: string; // absolute path
   *   private: boolean;
   *   version?: string;
   * }>}
   */
  const workspaces = JSON.parse(
    execSync(`pnpm list -r --json --depth -1`, {
      encoding: "utf8",
    })
  );

  // filter out any extra info, only return name and path
  return workspaces.map(({ name, path }) => ({ name, path }));
};

const _getWorkspacesYarnClassic = ({
  cwd = process.cwd(),
  execSync = cp.execSync,
} = {}) => {
  /**
   * @type {{
   *   [name: string]: {
   *     location: string; // relative path
   *     workspaceDependencies: string[];
   *     mismatchedWorkspaceDependencies: string[]
   *   }
   * }}
   */
  const workspaces = JSON.parse(
    execSync("yarn --silent workspaces info", {
      encoding: "utf8",
    })
  );

  // Yarn Classic does not include the root package.
  const rootPackageJSONPath = path.join(cwd, "package.json");
  const rootPackageJSON = require(rootPackageJSONPath);

  return [
    {
      name: rootPackageJSON.name,
      path: rootPackageJSONPath,
    },
    ...Object.entries(workspaces).map(([name, { location }]) => ({
      name,
      path: path.join(cwd, location),
    })),
  ];
};

const _getWorkspacesYarnBerry = ({
  cwd = process.cwd(),
  execSync = cp.execSync,
} = {}) => {
  // http://ndjson.org/
  const ndJSONWorkspaces = execSync("yarn workspaces list --json", {
    encoding: "utf8",
  });

  if (ndJSONWorkspaces != "") {
    /**
     * @type {Array<{
     *   name: string;
     *   location: string; // relative path
     * }>}
     */
    const workspaces = ndJSONWorkspaces
      .replace(/\n*$/, "") // strip out trailing new line
      .split("\n") // split on new line
      .map((str) => JSON.parse(str)); // parse each workspace

    return workspaces.map(({ location, name }) => ({
      name,
      path: path.join(cwd, location),
    }));
  }
  return [];
};

const getWorkspacesForPackageManager = (packageManager) => {
  switch (packageManager) {
    case "pnpm":
      return _getWorkspacesPNPM();
    case "yarn":
      return _getWorkspacesYarnClassic();
    case "berry":
      return _getWorkspacesYarnBerry();
    default:
      throw new Error(`${NO_PACKAGE_MANAGER} ${packageManager}`);
  }
};

module.exports = {
  getWorkspacesForPackageManager,
  _getWorkspacesPNPM,
  _getWorkspacesYarnClassic,
  _getWorkspacesYarnBerry,
};
