const chalk = require("chalk");
const { DEPENDENCY_TYPES } = require("../shared/constants");

const SINGLE_INDENT = 2;
const DOUBLE_INDENT = SINGLE_INDENT * 2;

/**
Get a string in the format:
  [version]:
     [...dependencyTypeStrings]

  that is

  16
    direct: mock-app-b
*/
const getVersionString = (version, dependencyTypeStrings) => {
  return (
    chalk.magentaBright(version.padStart(SINGLE_INDENT + version.length)) +
    "\n" +
    dependencyTypeStrings.join("\n")
  );
};

const groupDependenciesByType = (dependencyIds, dependenciesById) => {
  const dependencies = dependencyIds.map((id) => dependenciesById[id]);

  const direct = dependencies
    .filter((dep) => {
      return dep.type === DEPENDENCY_TYPES.DIRECT;
    })
    .map((dep) => dep.consumerName);
  const peer = dependencies
    .filter((dep) => dep.type === DEPENDENCY_TYPES.PEER)
    .map((dep) => dep.consumerName);
  const dev = dependencies
    .filter((dep) => dep.type === DEPENDENCY_TYPES.DEV)
    .map((dep) => dep.consumerName);

  return []
    .concat(
      direct.length ? getTypeString({ type: "direct", names: direct }) : []
    )
    .concat(peer.length ? getTypeString({ type: "peer", names: peer }) : [])
    .concat(dev.length ? getTypeString({ type: "dev", names: dev }) : []);
};

/**
Get a string in the format:
   [type]: [...names], that is:
   direct: name1, name2
*/
const getTypeString = ({ type, names }) => {
  const padded = type.padStart(DOUBLE_INDENT + type.length);
  return chalk.yellowBright(`${padded}: `) + chalk.white(names.join(", "));
};

const format = (packages, dependenciesById) => {
  return packages
    .map(({ name, versions }) => {
      const str = chalk.cyanBright.underline(name);

      const versionsStr = Object.entries(versions)
        .map(([version, dependencyIds]) => {
          const depTypeStrings = groupDependenciesByType(
            dependencyIds,
            dependenciesById
          );

          return getVersionString(version, depTypeStrings);
        })
        .join("\n");

      return `${str}\n${versionsStr}`;
    })
    .join("\n");
};

module.exports = { format };
