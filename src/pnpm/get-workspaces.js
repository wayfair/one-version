const { execSync } = require('child_process');

const getWorkspaces = () => {
  const workspaces = JSON.parse(
    execSync(`pnpm list -r --json --depth -1`, {
      encoding: 'utf8',
    })
  );

  // filter out any extra info, only return name and path
  return workspaces.map(({ name, path }) => ({ name, path }));
};

const pnpmApi = {
  getWorkspaces,
};

module.exports = pnpmApi;
