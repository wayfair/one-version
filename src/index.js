#! /usr/bin/env node
const { Command } = require("commander");
const { version } = require("../package.json");
const { check } = require("./check");
const chalk = require("chalk");

const program = new Command();

program
  .name("one-version")
  .usage("command [options]")
  .version(version, "-v, --version");

program
  .command("check")
  .description(
    "Verify that only one version of each dependency exists in a monorepo"
  )
  .option("-p, --packageManager <type>", "package manager", "pnpm")
  .action(({ packageManager }) => {
    try {
      check({ packageManager });
    } catch (e) {
      console.log(chalk.red(e.message));
      process.exit(1);
    }
  });

program.parse(process.argv);
