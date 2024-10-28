# PR Title Checker Action

This is a GitHub Action to check if Pull Request title or latest commit message conform to a specified format.

## Usage

Create a `.github/workflows/common-pr-title-checker.yaml` file in your repository with the following content:

```yaml
name: PR Title Checker

on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  check-pr-title:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Common PR Title Checker
        uses: xuthus5/pr-title-checker@v1
```

## Standard

PR titles should follow this format: `<type>(<scope>): <subject>`

- `type` must be one of the following:
  - feat: A new feature
  - fix: A bug fix
  - docs: Documentation changes
  - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - refactor: A code change that neither fixes a bug nor adds a feature
  - pref: A code change that improves performance
  - test: Adding missing tests or correcting existing tests
  - build: Changes that affect the build system or external dependencies
  - ci: Changes to CI configuration files and scripts
  - chore: Other changes that don't modify src or test files
  - revert: Reverts a previous commit
- `scope` is optional and enclosed in parentheses, indicating the scope of the change
- `subject` is a short description of the change, no more than 50 characters

Examples:
- `feat(auth): add user login functionality`
- `fix: resolve slow loading issue on homepage`
- `docs: update installation instructions in README`

**note**: action default rule follow the rules of [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)