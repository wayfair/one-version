const { execSync } = require('child_process');

const getWorkspaces = () => {
  // http://ndjson.org/
  const ndJSONWorkspaces = execSync('yarn workspaces list --json', {
    stdio: 'pipe',
  }).toString();

  const workspaces = ndJSONWorkspaces
    .replace(/\n*$/, '') // strip out trailing new line
    .split('\n') // split on new line
    .map((str) => JSON.parse(str)); // parse each workspace

  return workspaces.map(({ location, name }) => ({
    name,
    path: location,
  }));
};

const berryApi = {
  getWorkspaces,
};

module.exports = berryApi;
