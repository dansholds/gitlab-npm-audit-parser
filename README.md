# GitLab parser for NPM Audit

<p align="center">
  <a href="https://www.npmjs.com/package/@dansholds/gitlab-npm-audit-parser">
    <img src="https://img.shields.io/npm/v/@dansholds/gitlab-npm-audit-parser" />
  </a>
  <img src="https://img.shields.io/npm/l/@dansholds/gitlab-npm-audit-parser?color=yellow">
  <a href="https://github.com/dansholds/gitlab-npm-audit-parser/blob/main/CHANGELOG.md">
    <img src="https://img.shields.io/badge/&#9741-changelog-yellow">
  </a>
  <a href="https://github.com/dansholds/gitlab-npm-audit-parser/actions/workflows/ci.yml">
    <img src="https://github.com/dansholds/gitlab-npm-audit-parser/actions/workflows/ci.yml/badge.svg" >
  </a>
  <a href="https://github.com/dansholds/gitlab-npm-audit-parser/issues">
    <img src="https://img.shields.io/github/issues/dansholds/gitlab-npm-audit-parser">
  </a>
  <img src="https://img.shields.io/badge/dependencies-0-success">
  <img src="https://img.shields.io/snyk/vulnerabilities/npm/@dansholds/gitlab-npm-audit-parser">
</p>
<p align="center">
  <img src="https://img.shields.io/npm/dependency-version/@dansholds/gitlab-npm-audit-parser/dev/webpack">
  <img src="https://img.shields.io/node/v-lts/@dansholds/gitlab-npm-audit-parser?color=blue">
  <img src="https://img.shields.io/bundlephobia/min/@dansholds/gitlab-npm-audit-parser" />
  <img src="https://img.shields.io/github/last-commit/dansholds/gitlab-npm-audit-parser">
</p>

    Usage: gitlab-npm-audit-parser [options]

    Input: Stdin via pipe
      npm audit --json | gitlab-npm-audit-parser ...
      cat <file> | gitlab-npm-audit-parser ...

    Options:

      -V, --version     output the version number
      -o, --out <path>  output filename, defaults to gl-dependency-scanning-report.json
      -h, --help        output usage information

## Package Objective

Perform the data translation from an `npm audit --json` report output to the
GitLab.com standardized JSON schema format specifically for ingest of dependency
scanning reports of a project.

## Why?

GitLab requires a common schema to ingest scanning reports from multiple
different dependency auditing tools across different languages. In the
JavaScript/TypeScript ecosystem, most of us use `npm audit` to verify project
dependencies but the JSON report is not ingestable by GitLab.com. It requires
this package as middleware to translate an `npm audit --json` report into the
standard dependency audit schema before it can be uploaded and ingested as a
dependency_scanning artifact. Ingested artifacts can then be used as data
sources to generate interactive content embedded in a pipeline results view or
Merge Request (MR) webpage.

**Why this library?** Because it's fast! We used
[Webpack](https://github.com/webpack/webpack) to generate a self-contained
bundle which means we have **0 dependencies** to download for production! With
NPX you can use this library direct from the cloud with minimal delay at 15.7KB
package size. We use Gitlab's published schema repository directly to help
construct the output code. For Developers, we also employ linting & automated
testing on the codebase to improve the development experience.

## Compatibility

| INGEST                  | SUPPORTED? | OUTPUT                                                 |
| ----------------------- | :--------: | ------------------------------------------------------ |
| npm-audit-report@^1.0.0 |    yes     | JSON file (dependency-scanning-report-format\@v14.0.3) |
| npm-audit-report@^2.0.0 |    yes     | JSON file (dependency-scanning-report-format\@v14.0.3) |

GitLab.org publishes their security report format to their own Package
Repository which is attached to their schema generation repository:
[gitlab-org/security-report-schemas](https://gitlab.com/gitlab-org/security-products/security-report-schemas).
This project targets the currently released report-format for Dependency
Scanning.

## How to use

Install this package into your devDependencies or use `npx` directly to download
the package at runtime. If you opt to download for use at run time, make sure to
include the correct scope name for the package since there are multiple versions
of this package on npmjs.com.

_I recommend the runtime option since this package is only needed in a GitLab
specific pipeline and not necessary to be locally installed for developer use._

```sh
# 1. Downloads at runtime use
npm audit --json | npx @dansholds/gitlab-npm-audit-parser -o gl-dependency-scanning.json

# 2. Install in devDependencies
npm install --save-dev @dansholds/gitlab-npm-audit-parser
```

Add the following job to `.gitlab-ci.yml`. If you used #2 and it is in your
devDependencies you may remove the `@<scope>` prefix from the following.

```yaml
dependency scanning:
  image: node:10-alpine
  script:
    - npm ci
    - npm audit --json | npx @dansholds/gitlab-npm-audit-parser -o
      gl-dependency-scanning.json
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning.json
```

NOTE: If you use a `npm run-script` to call `npm audit` due to set project
parameters, this library will ignore any prefixed stdout data prior to the first
open bracket for the JSON output. This way `npm run --silent` is no longer
required.

## Vulnerability Report

| Vulnerability |     PKG      | Category |     In Production Pkg?      | Notes                                                                 |
| ------------- | :----------: | :------: | :-------------------------: | --------------------------------------------------------------------- |
| RegExp DoS    | trim\@<0.0.3 |   High   | No _(DevDependency/Linter)_ | waiting for remark-parse\@^9.x.x release, owner will not patch v8.0.3 |

## Contributors

### Development Environment

- Use `nvm` for node version management (see `.nvmrc` for version requirement)
- Use latest npm version via `nvm install-latest-npm`

### Guidelines

- Code (including Markdown) must pass a linting checks
- Developmental repository must be compatible with NodeJS v12 LTS & `npm@^7.0.0`
- Distribution build must be compatible with v10
- Must have successful build & pass all test cases in both Node.js v10 LTS, v12
  LTS, & v14 LTS
- Releases will have all non-breaking changes in dependencies up-to-date

### Test

```sh
# Production build (CLI bundle) & Executes all test cases
npm run test:prod

# Verifies build process once, then runs tests against local files
npm test
npm run test:dev   # enable test watch mode

# Monitor build process & interactive lint
npm run build-watch
```

## Examples

| #   | INGEST FILE             |     | OUTPUT FILE                         |
| --- | ----------------------- | --- | ----------------------------------- |
| 1.  | `./test/v1_report.json` | =>  | `./test/snapshots/GL-report.1.json` |
| 2.  | `./test/v2_report.json` | =>  | `./test/snapshots/GL-report.2.json` |

## Future Features

- Add `-i|--in|--input <file>` option for handling file input

- Add support for input redirector `<(cat file.txt)`.

- Add testing, dependency, & closer integration with `npm-audit-report` library

- Configure a bot to monitor changes/updates to schema & audit reporter
  repository

## Extras

**COMING SOON!**
[gitlab-depscan-merger](https://github.com/dansholds/gitlab-depscan-merger): a
solution to create 1 ingestable dependency_scanning report from multiple audit
reports overcoming the GitLab pipeline limitation.

Check out my other projects at [@dansholds](https://github.com/dansholds) on
GitHub.com
