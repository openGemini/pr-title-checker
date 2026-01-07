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

import {
  ALLOWED_TYPES,
  MAX_DESCRIPTION_LENGTH,
  PATTERNS,
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_EXAMPLES,
} from './rules';
import { ValidationResult, ValidationError, TitleComponents, ValidatorOptions } from './types';

/**
 * Validator for Conventional Commits titles
 */
export class ConventionalCommitValidator {
  private readonly strict: boolean;
  private readonly maxDescriptionLength: number;

  constructor(options: ValidatorOptions = {}) {
    this.strict = options.strict ?? true;
    this.maxDescriptionLength = options.maxDescriptionLength ?? MAX_DESCRIPTION_LENGTH;
  }

  /**
   * Validates a commit title against the Conventional Commits specification
   */
  public validate(title: string): ValidationResult {
    const errors: ValidationError[] = [];

    // Check for non-ASCII characters first
    if (PATTERNS.nonAscii.test(title)) {
      errors.push(this.createError(ERROR_CODES.NON_ASCII_CHARACTERS));
    }

    // Parse the title into components
    const components = this.parseTitle(title);
    if (!components) {
      errors.push(this.createError(ERROR_CODES.INVALID_FORMAT));
      return { isValid: false, errors };
    }

    // Validate each component
    const typeErrors = this.validateType(components.type);
    const scopeErrors = this.validateScope(title, components.scope);
    const breakingChangeErrors = this.validateBreakingChange(title, components.isBreakingChange);
    const descriptionErrors = this.validateDescription(title, components.description);

    errors.push(...typeErrors, ...scopeErrors, ...breakingChangeErrors, ...descriptionErrors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Parses a title into its components
   */
  private parseTitle(title: string): TitleComponents | null {
    // Extract type (preserve case for validation)
    const typeMatch = title.match(/^([a-zA-Z]+)/);
    if (!typeMatch) return null;
    const type = typeMatch[1];

    // Find colon
    const colonIndex = title.indexOf(':');
    if (colonIndex === -1) return null;

    // Extract everything before colon for analysis
    const beforeColon = title.substring(0, colonIndex);

    // Extract scope (optional, allow empty for validation)
    const scopeMatch = beforeColon.match(/\(([^)]*)\)/);
    const scope = scopeMatch ? scopeMatch[1] : undefined;

    // Check for breaking change marker (only before colon)
    const isBreakingChange = beforeColon.includes('!');

    // Check for space before colon (invalid format: "feat :" or "feat(scope) :")
    // Build expected prefix (allowing for wrong ! position for later validation)
    const withoutExclamation = beforeColon.replace(/!/g, '');
    const expectedWithoutExclamation = type + (scopeMatch ? scopeMatch[0] : '');
    if (withoutExclamation !== expectedWithoutExclamation) {
      return null;  // Something unexpected before colon (likely a space)
    }

    // Extract description (everything after ":" - don't trim to preserve spaces for validation)
    let description = title.substring(colonIndex + 1);

    return {
      type,
      scope,
      isBreakingChange,
      description,
    };
  }

  /**
   * Validates the type component
   */
  private validateType(type: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if type contains uppercase letters
    if (/[A-Z]/.test(type)) {
      errors.push(this.createError(ERROR_CODES.TYPE_NOT_LOWERCASE));
    }

    // Check if type (lowercased) is in the allowed list
    if (!ALLOWED_TYPES.includes(type.toLowerCase() as any)) {
      errors.push(this.createError(ERROR_CODES.INVALID_TYPE));
    }

    return errors;
  }

  /**
   * Validates the scope component
   */
  private validateScope(title: string, scope?: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for empty scope
    if (scope !== undefined && scope.length === 0) {
      errors.push(this.createError(ERROR_CODES.EMPTY_SCOPE));
      return errors;
    }

    if (scope !== undefined && scope.length > 0) {
      // In strict mode, check that scope doesn't contain uppercase
      if (this.strict && /[A-Z]/.test(scope)) {
        errors.push(this.createError(ERROR_CODES.SCOPE_NOT_LOWERCASE));
      }

      // Check scope format: only letters, numbers, hyphens, and underscores (case-insensitive for lenient mode)
      if (this.strict) {
        if (!/^[a-z0-9_-]+$/.test(scope)) {
          errors.push(this.createError(ERROR_CODES.INVALID_SCOPE_FORMAT));
        }
      } else {
        if (!/^[a-zA-Z0-9_-]+$/.test(scope)) {
          errors.push(this.createError(ERROR_CODES.INVALID_SCOPE_FORMAT));
        }
      }
    }

    return errors;
  }

  /**
   * Validates the breaking change marker
   */
  private validateBreakingChange(title: string, isBreakingChange: boolean): ValidationError[] {
    const errors: ValidationError[] = [];

    const colonIndex = title.indexOf(':');
    const exclamationIndex = title.indexOf('!');

    if (isBreakingChange) {
      // The ! must be before the colon
      if (exclamationIndex === -1 || exclamationIndex >= colonIndex) {
        errors.push(this.createError(ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION));
        return errors;
      }

      // Check that ! is in the right position (immediately before colon, after type or scope)
      // Valid: feat!: or feat(scope)!:
      // Invalid: fea!t: or feat!(scope): or f!eat:
      const validBreakingPattern = /^[a-z]+(\([^)]*\))?!:/i;
      if (!validBreakingPattern.test(title)) {
        errors.push(this.createError(ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION));
      }
    } else {
      // If no breaking change marker before colon, check if it's in the description (invalid)
      if (exclamationIndex !== -1 && exclamationIndex > colonIndex) {
        errors.push(this.createError(ERROR_CODES.INVALID_BREAKING_CHANGE_POSITION));
      }
    }

    return errors;
  }

  /**
   * Validates the description component
   */
  private validateDescription(title: string, description: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for colon and space
    if (!title.includes(': ')) {
      errors.push(this.createError(ERROR_CODES.MISSING_SPACE_AFTER_COLON));
    }

    // Check for multiple spaces after colon
    if (/:\s{2,}/.test(title)) {
      errors.push(this.createError(ERROR_CODES.MULTIPLE_SPACES_AFTER_COLON));
    }

    // Remove leading space if present (should be exactly one)
    let cleanDescription = description;
    if (cleanDescription.startsWith(' ')) {
      cleanDescription = cleanDescription.substring(1);
    }

    // Check if description is empty
    if (!cleanDescription || cleanDescription.trim().length === 0) {
      errors.push(this.createError(ERROR_CODES.MISSING_DESCRIPTION));
      return errors;
    }

    // Check for leading space in description (after the first space)
    if (cleanDescription.startsWith(' ')) {
      errors.push(this.createError(ERROR_CODES.DESCRIPTION_HAS_LEADING_SPACE));
    }

    // Check for trailing space in description
    if (cleanDescription.endsWith(' ')) {
      errors.push(this.createError(ERROR_CODES.DESCRIPTION_HAS_TRAILING_SPACE));
    }

    // Check description length
    if (cleanDescription.length > this.maxDescriptionLength) {
      errors.push({
        code: ERROR_CODES.DESCRIPTION_TOO_LONG,
        message: `Description must not exceed ${this.maxDescriptionLength} characters`,
        example: ERROR_EXAMPLES[ERROR_CODES.DESCRIPTION_TOO_LONG],
      });
    }

    // Strict mode checks
    if (this.strict) {
      // Check that description starts with lowercase
      const trimmedDescription = cleanDescription.trim();
      if (trimmedDescription.length > 0 && !PATTERNS.descriptionStartsLowercase.test(trimmedDescription)) {
        errors.push(this.createError(ERROR_CODES.DESCRIPTION_NOT_LOWERCASE));
      }

      // Check that description doesn't end with a period
      if (PATTERNS.endsWithPeriod.test(trimmedDescription)) {
        errors.push(this.createError(ERROR_CODES.DESCRIPTION_ENDS_WITH_PERIOD));
      }

      // Suggest imperative mood (not an error, just a suggestion)
      // We check if the description starts with common non-imperative patterns
      const firstWord = trimmedDescription.split(' ')[0].toLowerCase();
      const nonImperativePatterns = /^(added|adds|adding|updated|updates|updating|fixed|fixes|fixing|removed|removes|removing|deleted|deletes|deleting)$/i;
      if (nonImperativePatterns.test(firstWord)) {
        errors.push(this.createError(ERROR_CODES.NON_IMPERATIVE_MOOD));
      }
    }

    return errors;
  }

  /**
   * Creates a validation error object
   */
  private createError(code: keyof typeof ERROR_CODES): ValidationError {
    return {
      code: ERROR_CODES[code],
      message: ERROR_MESSAGES[code],
      example: ERROR_EXAMPLES[code],
    };
  }
}
