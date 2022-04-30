const {execSync} = require('child_process');

const getWorkspaces = () => {
  const workspaces = JSON.parse(
    execSync('yarn --silent workspaces info', {stdio: 'pipe'}).toString()
  );

  return Object.entries(workspaces).map(([name, {location}]) => ({
    name,
    path: location,
  }));
};

const yarnApi = {
  getWorkspaces,
};

module.exports = yarnApi;
