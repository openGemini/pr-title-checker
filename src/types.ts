/**
 * Result of validating a commit title
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * A single validation error
 */
export interface ValidationError {
  code: string;
  message: string;
  example?: string;
}

/**
 * Parsed components of a conventional commit title
 */
export interface TitleComponents {
  type: string;
  scope?: string;
  isBreakingChange: boolean;
  description: string;
}

/**
 * Options for the validator
 */
export interface ValidatorOptions {
  strict?: boolean;
}
