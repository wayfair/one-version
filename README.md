<div align="center">

[![Release](https://img.shields.io/github/v/release/wayfair/one-version?display_name=tag)](CHANGELOG.md)
[![license: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Maintainer](https://img.shields.io/badge/Maintainer-Wayfair-7F187F)](https://wayfair.github.io)

</div>

<h2 align="center">@wayfair/one-version</h2>
<div align="center" >
<i>One Version to rule them all, One Version to find them,

One Version to bring them all, and in the darkness bind them.<sup>1</sup>
</i>

</div>

<h3 align="center">Opinionated Monorepo Dependency Management CLI</h3>

**🚨 Enforcement**: Require all workspaces in a monorepo to conform to the [One-Version rule](#one-version-rule).

**📦 Supports multiple package managers**: Support for `yarn` and `pnpm` workspaces.

**💥 Coordinated upgrades**: Coming Soon!

---

## Table Of Contents

- [One-Version Rule](#one-version-rule)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## One-Version Rule

This package implements a version of Google's `One-Version Rule`:

> For every dependency in [a] repository, there must be only one version of that dependency to choose.<sup>2</sup>

Please refer to the [implementation notes](ONE-VERSION.md) for our specific evaluation criteria.

There is some overlap between this tool and [experimental yarn constraints](https://yarnpkg.com/features/constraints), without requiring use of a particular package manager.

## Getting Started

Install `@wayfair/one-version` at the workspace root using yarn:

```bash
yarn add --dev -w @wayfair/one-version
```

Or pnpm:

```bash
pnpm add -save-dev -w @wayfair/one-version
```

Add the following section to your package.json:

```json
{
  "scripts": {
    "one-version:check": "one-version check -p ${yarn | pnpm}"
  }
}

```

The `-p` flag is not required if using `pnpm`.

Run `yarn one-version:check` or `pnpm run one-version:check`.

If the repo is compliant, the tool will print this message:

```text
✨ One Version Rule Success - found no version conflicts!
```  

If the repo is not compliant, you will see a version of this message:

```text
🚫 One Version Rule Failure - found multiple versions of the following dependencies:

prettier
  2.1.2
    dev: @wayfair/app-a, @wayfair/app-b
  ^2.3.2
    dev: @wayfair/app-c
  2.2.1
    dev: @wayfair/lib-a
```

## Configuration

The behavior of `@wayfair/one-version` can be configured by a `one-version.config.json` at the root of the repository.

### Supported Options

#### overrides (optional, object)

Overrides lets workspaces opt out of the one-version rule. This may be useful while performing major upgrades.

#### packageManager (optional, string)

Used to specify the package manager for the workspace.

_Note: If the `-p` or `--packageManager` argument is included in the command it will take precedence over this value_.

Supported values: `pnpm`, `yarn`

### Examples

```json
"overrides": {
  "dependency": {
    "versionSpecifier": ["workspaceA", "workspaceB"]
  }
},
"packageManager": "pnpm"
```

For example, the below config will allow `app-A` and `lib-L` to specify `react@^16.9`, even if the rest of the repo specifies `react@^17`.

```json
{
  "overrides": {
    "react": {
      "^16.9": ["app-A", "lib-L"]
    }
  }
}
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated** 💜. For contributing guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Distributed under the `MIT` License. See `LICENSE` for more information.

---

`1`: J.R.R. Tolkien, 1954. Mostly.

`2`: [Software Engineering At Google](https://abseil.io/resources/swe_at_google.2.pdf) - Winters, Manshreck and Wright, 2020, p. 341
