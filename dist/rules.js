"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_EXAMPLES = exports.ERROR_MESSAGES = exports.ERROR_CODES = exports.PATTERNS = exports.MAX_DESCRIPTION_LENGTH = exports.ALLOWED_TYPES = void 0;
/**
 * Allowed commit types according to Conventional Commits specification
 */
exports.ALLOWED_TYPES = [
    'feat', // A new feature
    'fix', // A bug fix
    'docs', // Documentation changes
    'style', // Changes that do not affect the meaning of the code
    'refactor', // A code change that neither fixes a bug nor adds a feature
    'perf', // A code change that improves performance
    'test', // Adding missing tests or correcting existing tests
    'build', // Changes that affect the build system or external dependencies
    'ci', // Changes to CI configuration files and scripts
    'chore', // Other changes that don't modify src or test files
    'revert', // Reverts a previous commit
];
/**
 * Maximum length for the description part
 */
exports.MAX_DESCRIPTION_LENGTH = 50;
/**
 * Regular expressions for validation
 */
exports.PATTERNS = {
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
};
/**
 * Error codes for different validation failures
 */
exports.ERROR_CODES = {
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
};
/**
 * Error messages for validation failures
 */
exports.ERROR_MESSAGES = {
    [exports.ERROR_CODES.INVALID_FORMAT]: 'Title format is incorrect. Expected format: <type>[optional scope][optional !]: <description>',
    [exports.ERROR_CODES.INVALID_TYPE]: `Type must be one of: ${exports.ALLOWED_TYPES.join(', ')}`,
    [exports.ERROR_CODES.TYPE_NOT_LOWERCASE]: 'Type must be lowercase',
    [exports.ERROR_CODES.EMPTY_SCOPE]: 'Scope cannot be empty. Either provide a scope or omit the parentheses',
    [exports.ERROR_CODES.INVALID_SCOPE_FORMAT]: 'Scope format is incorrect. Scope should only contain lowercase letters, numbers, hyphens, and underscores',
    [exports.ERROR_CODES.SCOPE_NOT_LOWERCASE]: 'Scope must be lowercase (strict mode)',
    [exports.ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION]: 'Breaking change marker (!) must be placed after the scope (or type if no scope) and before the colon',
    [exports.ERROR_CODES.MISSING_DESCRIPTION]: 'Description is required after the colon and space',
    [exports.ERROR_CODES.DESCRIPTION_TOO_LONG]: `Description must not exceed ${exports.MAX_DESCRIPTION_LENGTH} characters`,
    [exports.ERROR_CODES.DESCRIPTION_NOT_LOWERCASE]: 'Description must start with a lowercase letter (strict mode)',
    [exports.ERROR_CODES.DESCRIPTION_ENDS_WITH_PERIOD]: 'Description must not end with a period (strict mode)',
    [exports.ERROR_CODES.DESCRIPTION_HAS_LEADING_SPACE]: 'Description must not start with a space',
    [exports.ERROR_CODES.DESCRIPTION_HAS_TRAILING_SPACE]: 'Description must not end with a space',
    [exports.ERROR_CODES.MISSING_SPACE_AFTER_COLON]: 'There must be exactly one space after the colon',
    [exports.ERROR_CODES.MULTIPLE_SPACES_AFTER_COLON]: 'There must be exactly one space after the colon, not multiple spaces',
    [exports.ERROR_CODES.NON_ASCII_CHARACTERS]: 'Title must only contain displayable ASCII characters (range: 32-126)',
    [exports.ERROR_CODES.NON_IMPERATIVE_MOOD]: 'Description should use imperative mood (e.g., "add" not "added" or "adds")',
};
/**
 * Examples of correct titles for each error type
 */
exports.ERROR_EXAMPLES = {
    [exports.ERROR_CODES.INVALID_FORMAT]: 'feat(auth): add user login',
    [exports.ERROR_CODES.INVALID_TYPE]: 'feat: add new feature',
    [exports.ERROR_CODES.TYPE_NOT_LOWERCASE]: 'feat: add new feature',
    [exports.ERROR_CODES.EMPTY_SCOPE]: 'feat(auth): add user login',
    [exports.ERROR_CODES.INVALID_SCOPE_FORMAT]: 'feat(user-auth): add login',
    [exports.ERROR_CODES.SCOPE_NOT_LOWERCASE]: 'feat(auth): add user login',
    [exports.ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION]: 'feat(api)!: breaking change',
    [exports.ERROR_CODES.MISSING_DESCRIPTION]: 'feat: add new feature',
    [exports.ERROR_CODES.DESCRIPTION_TOO_LONG]: 'feat: add user authentication',
    [exports.ERROR_CODES.DESCRIPTION_NOT_LOWERCASE]: 'feat: add user authentication',
    [exports.ERROR_CODES.DESCRIPTION_ENDS_WITH_PERIOD]: 'feat: add user authentication',
    [exports.ERROR_CODES.DESCRIPTION_HAS_LEADING_SPACE]: 'feat: add user authentication',
    [exports.ERROR_CODES.DESCRIPTION_HAS_TRAILING_SPACE]: 'feat: add user authentication',
    [exports.ERROR_CODES.MISSING_SPACE_AFTER_COLON]: 'feat: add new feature',
    [exports.ERROR_CODES.MULTIPLE_SPACES_AFTER_COLON]: 'feat: add new feature',
    [exports.ERROR_CODES.NON_ASCII_CHARACTERS]: 'feat: add user authentication',
    [exports.ERROR_CODES.NON_IMPERATIVE_MOOD]: 'feat: add feature (not "added" or "adds")',
};
