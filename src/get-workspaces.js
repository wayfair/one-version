const { execSync } = require("child_process");
const path = require("path");
const { NO_CHECK_API_ERROR } = require("./shared/constants");

function getWorkspacesPNPM() {
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
}

function getWorkspacesYarnClassic(cwd) {
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
    execSync("yarn --silent workspaces info", { stdio: "pipe" }).toString()
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
}

function getWorkspacesYarnBerry(cwd) {
  // http://ndjson.org/
  const ndJSONWorkspaces = execSync("yarn workspaces list --json", {
    stdio: "pipe",
  }).toString();

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

module.exports = function getWorkspaces(packageManager) {
  switch (packageManager) {
    case "pnpm":
      return getWorkspacesPNPM();
    case "yarn":
      return getWorkspacesYarnClassic();
    case "berry":
      return getWorkspacesYarnBerry();
    default:
      throw new Error(`${NO_CHECK_API_ERROR} ${packageManager}`);
  }
};
