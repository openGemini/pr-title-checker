# PR Title Checker Action

A GitHub Action that validates Pull Request titles against the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Features

- Full support for Conventional Commits v1.0.0 specification
- Validates PR title format: `<type>[optional scope][optional !]: <description>`
- Supports breaking change markers (`!`)
- Configurable strict mode for enhanced validation
- Clear, actionable error messages with examples
- No external dependencies beyond GitHub Actions toolkit

## Usage

Create a `.github/workflows/pr-title-checker.yml` file in your repository:

```yaml
name: PR Title Lint

on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  check-title:
    name: Check PR Title
    runs-on: ubuntu-latest
    steps:
      - name: Validate PR Title
        uses: openGemini/pr-title-checker@main
```

### With Custom Configuration

```yaml
- name: Validate PR Title
  uses: openGemini/pr-title-checker@main
  with:
    strict: 'true'  # Enable strict mode (default)
```

## Specification

### Format

```
<type>[optional scope][optional !]: <description>
```

### Type

**Required.** Must be one of the following (lowercase only):

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring (neither fixes a bug nor adds a feature)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system or external dependency changes
- `ci` - CI configuration changes
- `chore` - Other changes that don't modify src or test files
- `revert` - Reverting a previous commit

### Scope

**Optional.** Indicates the area of change. If provided:
- Must be enclosed in parentheses: `(scope)`
- Can only contain lowercase letters, numbers, hyphens, and underscores
- Cannot be empty (use no scope instead of `()`)

**Examples:**
- `feat(auth): add login`
- `fix(api): handle timeout`
- `docs(readme): update usage`

### Breaking Change Marker

**Optional.** Use `!` to indicate a breaking change:
- Must be placed after the scope (or type if no scope)
- Must be before the colon

**Examples:**
- `feat!: breaking change`
- `feat(api)!: breaking API change`

### Description

**Required.** A brief description of the change:
- Maximum 50 characters
- Must have exactly one space after the colon
- Cannot start or end with spaces
- Must contain only displayable ASCII characters (range: 32-126)

#### Strict Mode Rules

When strict mode is enabled (default), the description must also:
- Start with a lowercase letter
- Not end with a period
- Use imperative mood (e.g., "add" not "added" or "adds")

## Examples

### Valid Titles

```
feat: add user authentication
fix: resolve memory leak
docs: update installation guide
style: format code with prettier
refactor: simplify error handling
perf: optimize database queries
test: add unit tests for api
build: update webpack config
ci: configure github actions
chore: update dependencies
revert: undo breaking change
feat(auth): add oauth2 support
fix(api): handle timeout errors
docs(readme): clarify usage examples
feat(api)!: breaking change in api
fix!: critical security fix
```

### Invalid Titles

```
Feature: add something          # Invalid type
feat : add something            # Space before colon
feat:add something              # Missing space after colon
feat: Add something             # Uppercase start (strict mode)
feat: add something.            # Period at end (strict mode)
feat: added something           # Past tense (strict mode)
feat(): add something           # Empty scope
feat(API): add endpoint         # Uppercase in scope (strict mode)
feat: 这是中文                  # Non-ASCII characters
feat: add user authentication that is very long description exceeding limit  # Too long (>50 chars)
```

## Configuration

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `strict` | Enable strict mode validation | No | `true` |

### Strict Mode

When enabled (default), strict mode enforces additional rules:
- Description must start with a lowercase letter
- Description must not end with a period
- Description should use imperative mood

To disable strict mode:

```yaml
- name: Validate PR Title
  uses: openGemini/pr-title-checker@main
  with:
    strict: 'false'
```

## Troubleshooting

### Common Issues

1. **"Type must be lowercase"**
   - Use `feat` not `Feat` or `FEAT`

2. **"Description must start with lowercase letter"**
   - Use `feat: add feature` not `feat: Add feature`
   - Disable strict mode if you prefer uppercase

3. **"Description should use imperative mood"**
   - Use `feat: add feature` not `feat: added feature` or `feat: adds feature`
   - Think of completing the sentence: "This commit will..."

4. **"Scope format is incorrect"**
   - Use lowercase, numbers, hyphens, or underscores only
   - `feat(user-auth): ...` is valid
   - `feat(User Auth): ...` is invalid

5. **"Breaking change marker must be placed after scope"**
   - Use `feat(api)!: change` not `feat!(api): change`

## Development

### Building

```bash
npm install
npm run build
```

### Testing

```bash
npm test
```

### Local Testing

You can test the action locally by running:

```bash
npm run build
node dist/index.js
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Learn More

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
