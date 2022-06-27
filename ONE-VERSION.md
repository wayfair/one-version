## Implementation Notes

The exact method used to determine a violation of the `One-Version` rule vary by package manager.

### Yarn

**Note**: Unless stated otherwise, `yarn` refers to `yarn` v1. `Berry` will be used to refer to `yarn` v2+.

Yarn workspaces contain a single, flat lockfile at the repository root. The lockfile entries apply to all workspaces in the repository.

In the below snippet there are two lockfile entries for the same dependency, `@babel/code-frame`. The resolved version depends on the version specifier requested, i.e. `^7.16.0` will resolve to `7.16.2`, but `^7.14.5` and `^7.0.0` will resolve to `7.15.8`.

```text
"@babel/code-frame:^7.16.0":
  version: 7.16.2
  ...

"@babel/code-frame:^7.0.0, @babel/code-frame@npm:^7.14.5":
  version: 7.15.8
  ...
```

As shown above, a lockfile may contain multiple entries for a given dependency, and a given entry may represent multiple compatible version specifiers. However, a given version specifier will **not** appear in multiple entries for a dependency, i.e. all packages which specify `^7.0.0` will resolve to the same version.

Enforcement of the `One-Version` rule could be done in (at least) two ways:

- Read all manifests (`package.json`) and compare the version specifiers for each dependency to the lockfile entries. If all version specifiers are compatible and resolve to the same version, the repo is compliant.
- Read all manifests and compare the version specifiers. If all version specifiers across the workspace are exactly the same, they all share the same lockfile entry which can only resolve to a single version.

This library has chosen to use the second method described. This avoids the need to check the lockfile, and simplifies error reporting. This means while two packages may specify compatible versions which resolve to the same version, i.e. `^7.2.0` and `^7.1.0` both resolving to `7.2.0`, the check **will fail**.

### PNPM

**Note**: This is still under development.

`pnpm` also utilizes a single lockfile at the repository root, but unlike `yarn`, this lockfile is not flat - the entries are nested for each workspace.

The below snippet shows the resolutions of two workspaces in a repo, both of which specify the same version of the example package `@wayfair/ui`, `^8`.

```yml

apps/workspace-a:
  specifiers:
     '@wayfair/ui': ^8
  dependencies:
    '@wayfair/ui': 8.0.0_66b146768d72279e63e637aae37792af

apps/workspace-b:
  specifiers:
     '@wayfair/ui': ^8
  dependencies:
    '@wayfair/ui': 8.0.1_b88fe22cf250f8fb4b578ded3c75a78e
```

Although using the same specifier, the entries resolve to two different versions - `8.0.0` and `8.0.1`. Thus, for `pnpm` workspaces, it is not sufficient to only check that the manifest version specifiers match across a workspace. The lockfile must also be read to validate that the resolved versions match.

### Notes

- This library currently only operates on declared dependencies. That is the `dependencies`, `devDependencies`, and `peerDependencies` specified by a workspace - **not** any transitive dependencies.
- Resolutions are not yet taken into account.
- Package manager is selected based on the lockfile name in the root of the repo. Berry is chosen over Yarn classic if a `.yarnrc.yml` file exists at the root of the repo.
