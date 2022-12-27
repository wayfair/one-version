# Contributing

Thanks for your interest in contributing to `@wayfair/one-version`! Here are a few general guidelines on contributing and
reporting bugs that we ask you to review. Following these guidelines helps to communicate that you respect the time of
the contributors managing and developing this open source project. In return, they should reciprocate that respect in
addressing your issue, assessing changes, and helping you finalize your pull requests.

In that spirit of mutual respect,
we endeavour to review incoming issues and pull requests within 10 days, and will close any lingering issues or pull
requests after 60 days of inactivity.

Please note that all of your interactions in the project are subject to our [Code of Conduct](CODE_OF_CONDUCT.md). This
includes creation of issues or pull requests, commenting on issues or pull requests, and extends to all interactions in
any real-time space (eg. Slack, Discord, etc).

## Development & Pull Requests

- Ensure you have [`node`](https://nodejs.org/en/download/package-manager/) and [`yarn`](https://yarnpkg.com/getting-started/install) installed

- [Fork the repo](https://help.github.com/articles/fork-a-repo/) and create your branch from main

```bash
git clone https://github.com/<your_username>/one-version
cd one-version
git checkout -b my_branch
```

Note: Replace <your_username> with your GitHub username

- Install dependencies by running

```bash
yarn
```

- Run jest tests by running

```bash
yarn test
```

- Complete development on your branch, adding additional specs to validate your changes

- Submit a PR when finished developing, ensuring the following:
  - All GitHub checks are passing (lints, tests, etc)
  - The PR description includes a description of the changes
  - A brief description of the change has been added to the `[Unreleased]` section of the `CHANGELOG.md`, optionally linking to a related issue
  - When applicable, the PR description links to the issue which describes the bug and/or feature the PR resolves

We expect pull requests to include automated tests for any changed behavior. We will do our best to review, merge & release changes in a timely manner. However - since we follow semantic versioning, proposed breaking changes may not be merged until the next major release.

## Reporting Issues

Before reporting a new issue, please ensure that the issue was not already reported or fixed.

When creating a new issue, please use the issue creation form and include as much relevant information as possible. This may include a minimal reproduction repo or other test case.

**If you discover a security bug, please do not report it through GitHub. Instead, please see security procedures in
[SECURITY.md](SECURITY.md).**

## Other Ways to Contribute

We welcome anyone that wants to contribute to `@wayfair/one-version` to triage and reply to open issues to help troubleshoot
and fix existing bugs. Here is what you can do:

- Help ensure that existing issues follows the recommendations from the _[Reporting Issues](#reporting-issues)_ section,
  providing feedback to the issue's author on what might be missing.
- Review existing pull requests, and testing patches against real existing applications that use `@wayfair/one-version`.
- Write a test, or add a missing test case to an existing test.

Thanks again for your interest on contributing to `@wayfair/one-version`!

:heart:
