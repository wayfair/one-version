const chalk = require('chalk');

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
    '\n' +
    dependencyTypeStrings.join('\n')
  );
};

/**
Get a string in the format:
   [type]: [...names], that is:
   direct: name1, name2
*/
const getTypeString = ({ type, names }) => {
  const padded = type.padStart(DOUBLE_INDENT + type.length);
  return chalk.yellowBright(`${padded}: `) + chalk.white(names.join(', '));
};

const format = (packages) => {
  return packages
    .map(([name, versions]) => {
      const str = chalk.cyanBright.underline(name);

      const versionsStr = Object.entries(versions)
        .map(([version, depTypes]) => {
          const depTypeStrings = Object.entries(depTypes).map(([type, names]) =>
            getTypeString({ type, names })
          );

          return getVersionString(version, depTypeStrings);
        })
        .join('\n');

      return `${str}\n${versionsStr}`;
    })
    .join('\n');
};

module.exports = { format };
