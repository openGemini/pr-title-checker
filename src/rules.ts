// Copyright 2026 openGemini Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Allowed commit types according to Conventional Commits specification
 */
export const ALLOWED_TYPES = [
  'feat',     // A new feature
  'fix',      // A bug fix
  'docs',     // Documentation changes
  'style',    // Changes that do not affect the meaning of the code
  'refactor', // A code change that neither fixes a bug nor adds a feature
  'perf',     // A code change that improves performance
  'test',     // Adding missing tests or correcting existing tests
  'build',    // Changes that affect the build system or external dependencies
  'ci',       // Changes to CI configuration files and scripts
  'chore',    // Other changes that don't modify src or test files
  'revert',   // Reverts a previous commit
] as const;

/**
 * Maximum length for the description part
 */
export const MAX_DESCRIPTION_LENGTH = 50;

/**
 * Regular expressions for validation
 */
export const PATTERNS = {
  // Basic format: type[(scope)][!]: description
  basicFormat: /^([a-z]+)(\([a-z0-9_-]+\))?(!)?: .+$/,

  // Type pattern: must be lowercase letters only
  type: /^([a-z]+)/,

  // Scope pattern: optional, in parentheses, lowercase letters, numbers, hyphens, underscores
  scope: /\(([a-z0-9_-]+)\)/,

  // Empty scope (invalid)
  emptyScope: /\(\)/,

  // Breaking change marker
  breakingChange: /!/,

  // Colon and space separator
  colonSpace: /: /,

  // Non-ASCII characters
  nonAscii: /[^\x20-\x7E]/,

  // Uppercase letters (for strict mode)
  uppercase: /[A-Z]/,

  // Description starts with lowercase (strict mode)
  descriptionStartsLowercase: /^[a-z]/,

  // Description ends with period (forbidden in strict mode)
  endsWithPeriod: /\.$/,

  // Leading or trailing spaces in description
  leadingSpace: /^: {2,}/,
  trailingSpace: / $/,

  // Common imperative verb patterns (for suggestions)
  imperativeVerbs: /^(add|update|remove|delete|fix|create|implement|refactor|optimize|improve|enhance|change|move|rename|extract|merge|split|document|test|bump|upgrade|downgrade|revert|release)/i,
} as const;

/**
 * Error codes for different validation failures
 */
export const ERROR_CODES = {
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_TYPE: 'INVALID_TYPE',
  TYPE_NOT_LOWERCASE: 'TYPE_NOT_LOWERCASE',
  EMPTY_SCOPE: 'EMPTY_SCOPE',
  INVALID_SCOPE_FORMAT: 'INVALID_SCOPE_FORMAT',
  SCOPE_NOT_LOWERCASE: 'SCOPE_NOT_LOWERCASE',
  INVALID_BREAKING_CHANGE_POSITION: 'INVALID_BREAKING_CHANGE_POSITION',
  MISSING_DESCRIPTION: 'MISSING_DESCRIPTION',
  DESCRIPTION_TOO_LONG: 'DESCRIPTION_TOO_LONG',
  DESCRIPTION_NOT_LOWERCASE: 'DESCRIPTION_NOT_LOWERCASE',
  DESCRIPTION_ENDS_WITH_PERIOD: 'DESCRIPTION_ENDS_WITH_PERIOD',
  DESCRIPTION_HAS_LEADING_SPACE: 'DESCRIPTION_HAS_LEADING_SPACE',
  DESCRIPTION_HAS_TRAILING_SPACE: 'DESCRIPTION_HAS_TRAILING_SPACE',
  MISSING_SPACE_AFTER_COLON: 'MISSING_SPACE_AFTER_COLON',
  MULTIPLE_SPACES_AFTER_COLON: 'MULTIPLE_SPACES_AFTER_COLON',
  NON_ASCII_CHARACTERS: 'NON_ASCII_CHARACTERS',
  NON_IMPERATIVE_MOOD: 'NON_IMPERATIVE_MOOD',
} as const;

/**
 * Error messages for validation failures
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_FORMAT]: 'Title format is incorrect. Expected format: <type>[optional scope][optional !]: <description>',
  [ERROR_CODES.INVALID_TYPE]: `Type must be one of: ${ALLOWED_TYPES.join(', ')}`,
  [ERROR_CODES.TYPE_NOT_LOWERCASE]: 'Type must be lowercase',
  [ERROR_CODES.EMPTY_SCOPE]: 'Scope cannot be empty. Either provide a scope or omit the parentheses',
  [ERROR_CODES.INVALID_SCOPE_FORMAT]: 'Scope format is incorrect. Scope should only contain lowercase letters, numbers, hyphens, and underscores',
  [ERROR_CODES.SCOPE_NOT_LOWERCASE]: 'Scope must be lowercase (strict mode)',
  [ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION]: 'Breaking change marker (!) must be placed after the scope (or type if no scope) and before the colon',
  [ERROR_CODES.MISSING_DESCRIPTION]: 'Description is required after the colon and space',
  [ERROR_CODES.DESCRIPTION_TOO_LONG]: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
  [ERROR_CODES.DESCRIPTION_NOT_LOWERCASE]: 'Description must start with a lowercase letter (strict mode)',
  [ERROR_CODES.DESCRIPTION_ENDS_WITH_PERIOD]: 'Description must not end with a period (strict mode)',
  [ERROR_CODES.DESCRIPTION_HAS_LEADING_SPACE]: 'Description must not start with a space',
  [ERROR_CODES.DESCRIPTION_HAS_TRAILING_SPACE]: 'Description must not end with a space',
  [ERROR_CODES.MISSING_SPACE_AFTER_COLON]: 'There must be exactly one space after the colon',
  [ERROR_CODES.MULTIPLE_SPACES_AFTER_COLON]: 'There must be exactly one space after the colon, not multiple spaces',
  [ERROR_CODES.NON_ASCII_CHARACTERS]: 'Title must only contain displayable ASCII characters (range: 32-126)',
  [ERROR_CODES.NON_IMPERATIVE_MOOD]: 'Description should use imperative mood (e.g., "add" not "added" or "adds")',
} as const;

/**
 * Examples of correct titles for each error type
 */
export const ERROR_EXAMPLES = {
  [ERROR_CODES.INVALID_FORMAT]: 'feat(auth): add user login',
  [ERROR_CODES.INVALID_TYPE]: 'feat: add new feature',
  [ERROR_CODES.TYPE_NOT_LOWERCASE]: 'feat: add new feature',
  [ERROR_CODES.EMPTY_SCOPE]: 'feat(auth): add user login',
  [ERROR_CODES.INVALID_SCOPE_FORMAT]: 'feat(user-auth): add login',
  [ERROR_CODES.SCOPE_NOT_LOWERCASE]: 'feat(auth): add user login',
  [ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION]: 'feat(api)!: breaking change',
  [ERROR_CODES.MISSING_DESCRIPTION]: 'feat: add new feature',
  [ERROR_CODES.DESCRIPTION_TOO_LONG]: 'feat: add user authentication',
  [ERROR_CODES.DESCRIPTION_NOT_LOWERCASE]: 'feat: add user authentication',
  [ERROR_CODES.DESCRIPTION_ENDS_WITH_PERIOD]: 'feat: add user authentication',
  [ERROR_CODES.DESCRIPTION_HAS_LEADING_SPACE]: 'feat: add user authentication',
  [ERROR_CODES.DESCRIPTION_HAS_TRAILING_SPACE]: 'feat: add user authentication',
  [ERROR_CODES.MISSING_SPACE_AFTER_COLON]: 'feat: add new feature',
  [ERROR_CODES.MULTIPLE_SPACES_AFTER_COLON]: 'feat: add new feature',
  [ERROR_CODES.NON_ASCII_CHARACTERS]: 'feat: add user authentication',
  [ERROR_CODES.NON_IMPERATIVE_MOOD]: 'feat: add feature (not "added" or "adds")',
} as const;
