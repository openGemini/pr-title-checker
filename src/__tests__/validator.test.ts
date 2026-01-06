import { describe, test, expect } from '@jest/globals';
import { ConventionalCommitValidator } from '../validator';

describe('ConventionalCommitValidator', () => {
  describe('valid titles', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test.each([
      'feat: add new feature',
      'fix: resolve memory leak',
      'docs: update readme',
      'style: format code',
      'refactor: restructure module',
      'perf: optimize query',
      'test: add unit tests',
      'build: update dependencies',
      'ci: configure pipeline',
      'chore: clean up files',
      'revert: undo previous commit',
      'feat(auth): add login',
      'fix(api): handle errors',
      'docs(readme): clarify usage',
      'feat(api)!: breaking change',
      'fix!: critical breaking fix',
      'feat(user-auth): add oauth2',
      'fix(api_v2): resolve timeout',
    ])('should accept valid title: %s', (title) => {
      const result = validator.validate(title);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('type validation', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should reject invalid type', () => {
      const result = validator.validate('feature: add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_TYPE')).toBe(true);
    });

    test('should reject uppercase type', () => {
      const result = validator.validate('Feat: add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'TYPE_NOT_LOWERCASE')).toBe(true);
    });

    test('should reject type with space', () => {
      const result = validator.validate('feat : add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_FORMAT')).toBe(true);
    });
  });

  describe('scope validation', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should accept valid scope with lowercase', () => {
      const result = validator.validate('feat(auth): add login');
      expect(result.isValid).toBe(true);
    });

    test('should accept scope with numbers', () => {
      const result = validator.validate('feat(api2): add endpoint');
      expect(result.isValid).toBe(true);
    });

    test('should accept scope with hyphens', () => {
      const result = validator.validate('feat(user-auth): add login');
      expect(result.isValid).toBe(true);
    });

    test('should accept scope with underscores', () => {
      const result = validator.validate('feat(api_v2): add endpoint');
      expect(result.isValid).toBe(true);
    });

    test('should reject empty scope', () => {
      const result = validator.validate('feat(): add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'EMPTY_SCOPE')).toBe(true);
    });

    test('should reject scope with uppercase in strict mode', () => {
      const result = validator.validate('feat(Auth): add login');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'SCOPE_NOT_LOWERCASE')).toBe(true);
    });

    test('should reject scope with special characters', () => {
      const result = validator.validate('feat(api@v2): add endpoint');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_SCOPE_FORMAT')).toBe(true);
    });

    test('should reject scope with spaces', () => {
      const result = validator.validate('feat(user auth): add login');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_SCOPE_FORMAT')).toBe(true);
    });
  });

  describe('breaking change validation', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should accept breaking change without scope', () => {
      const result = validator.validate('feat!: breaking change');
      expect(result.isValid).toBe(true);
    });

    test('should accept breaking change with scope', () => {
      const result = validator.validate('feat(api)!: breaking change');
      expect(result.isValid).toBe(true);
    });

    test('should reject breaking change marker in wrong position', () => {
      const result = validator.validate('feat!(api): breaking change');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_BREAKING_CHANGE_POSITION')).toBe(true);
    });

    test('should reject breaking change marker after colon', () => {
      const result = validator.validate('feat: breaking change!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_BREAKING_CHANGE_POSITION')).toBe(true);
    });
  });

  describe('description validation', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should reject missing colon', () => {
      const result = validator.validate('feat add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_FORMAT')).toBe(true);
    });

    test('should reject missing space after colon', () => {
      const result = validator.validate('feat:add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_SPACE_AFTER_COLON')).toBe(true);
    });

    test('should reject multiple spaces after colon', () => {
      const result = validator.validate('feat:  add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MULTIPLE_SPACES_AFTER_COLON')).toBe(true);
    });

    test('should reject empty description', () => {
      const result = validator.validate('feat: ');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_DESCRIPTION')).toBe(true);
    });

    test('should reject description with trailing space', () => {
      const result = validator.validate('feat: add something ');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DESCRIPTION_HAS_TRAILING_SPACE')).toBe(true);
    });

    test('should reject description that is too long', () => {
      const longDescription = 'a'.repeat(51);
      const result = validator.validate(`feat: ${longDescription}`);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DESCRIPTION_TOO_LONG')).toBe(true);
    });

    test('should accept description with exactly 50 characters', () => {
      const description = 'a'.repeat(50);
      const result = validator.validate(`feat: ${description}`);
      expect(result.isValid).toBe(true);
    });
  });

  describe('strict mode rules', () => {
    const strictValidator = new ConventionalCommitValidator({ strict: true });
    const lenientValidator = new ConventionalCommitValidator({ strict: false });

    test('should reject uppercase description start in strict mode', () => {
      const result = strictValidator.validate('feat: Add something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DESCRIPTION_NOT_LOWERCASE')).toBe(true);
    });

    test('should accept uppercase description start in lenient mode', () => {
      const result = lenientValidator.validate('feat: Add something');
      expect(result.isValid).toBe(true);
    });

    test('should reject description ending with period in strict mode', () => {
      const result = strictValidator.validate('feat: add something.');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DESCRIPTION_ENDS_WITH_PERIOD')).toBe(true);
    });

    test('should accept description ending with period in lenient mode', () => {
      const result = lenientValidator.validate('feat: add something.');
      expect(result.isValid).toBe(true);
    });

    test('should suggest imperative mood in strict mode', () => {
      const result = strictValidator.validate('feat: added something');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_IMPERATIVE_MOOD')).toBe(true);
    });

    test('should not check imperative mood in lenient mode', () => {
      const result = lenientValidator.validate('feat: added something');
      expect(result.isValid).toBe(true);
    });

    test.each([
      'feat: added feature',
      'feat: adds feature',
      'feat: adding feature',
      'feat: updated code',
      'feat: updates code',
      'feat: updating code',
      'feat: fixed bug',
      'feat: fixes bug',
      'feat: fixing bug',
      'feat: removed file',
      'feat: removes file',
      'feat: removing file',
    ])('should detect non-imperative mood: %s', (title) => {
      const result = strictValidator.validate(title);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_IMPERATIVE_MOOD')).toBe(true);
    });
  });

  describe('ASCII character validation', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should reject non-ASCII characters', () => {
      const result = validator.validate('feat: add 中文 support');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_ASCII_CHARACTERS')).toBe(true);
    });

    test('should reject emoji', () => {
      const result = validator.validate('feat: add feature 🎉');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_ASCII_CHARACTERS')).toBe(true);
    });

    test('should accept special ASCII characters', () => {
      const result = validator.validate('feat: add @#$%^&*()_+-=[]{}|;:,.<>?');
      expect(result.isValid).toBe(true);
    });
  });

  describe('edge cases', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should handle title with only type and colon', () => {
      const result = validator.validate('feat:');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_SPACE_AFTER_COLON')).toBe(true);
    });

    test('should handle empty string', () => {
      const result = validator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_FORMAT')).toBe(true);
    });

    test('should handle title with newlines', () => {
      const result = validator.validate('feat: add\nfeature');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_ASCII_CHARACTERS')).toBe(true);
    });

    test('should handle title with tabs', () => {
      const result = validator.validate('feat: add\tfeature');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'NON_ASCII_CHARACTERS')).toBe(true);
    });
  });

  describe('comprehensive integration tests', () => {
    const validator = new ConventionalCommitValidator({ strict: true });

    test('should validate completely correct title', () => {
      const result = validator.validate('feat(auth): add oauth2 support');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should report multiple errors at once', () => {
      const result = validator.validate('Feature: Added something.');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    test('should handle all components with breaking change', () => {
      const result = validator.validate('refactor(core)!: rewrite engine');
      expect(result.isValid).toBe(true);
    });
  });
});
