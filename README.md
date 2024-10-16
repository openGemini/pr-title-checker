# PR Title Checker Action

This is a GitHub Action to check if Pull Request titles conform to a specified format.

## Usage

Create a `.github/workflows/pr-title-checker.yml` file in your repository with the following content:

## Standard

PR titles should follow this format:

`type` must be one of the following:
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