import * as core from '@actions/core';
import * as github from '@actions/github';

interface TitleValidationResult {
  isValid: boolean;
  errors: string[];
  corrects: string[];
}

function validateTitle(title: string): TitleValidationResult {
  const result: TitleValidationResult = {
    isValid: true,
    errors: [],
    corrects: []
  };

  // Check basic format
  const formatRegex = /^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert)(\(.+\))?: .+$/;
  if (!formatRegex.test(title)) {
    result.isValid = false;
    result.errors.push('Title format is incorrect. It should be: <type>(<scope>): <subject>');
    result.corrects.push('feat(prom): add router for prom module')
  }

  // Check type
  const typeRegex = /^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert)/;
  if (!typeRegex.test(title)) {
    result.isValid = false;
    result.errors.push('Type must be one of: feat, fix, docs, style, refactor, test, perf, build, ci, chore, revert');
    result.corrects.push('ci: change pr lint pattern')
  }

  // Check space after colon
  if (title.includes(':')) {
    if (!/^[^:]+: [^ ]/.test(title)) {
      result.isValid = false;
      result.errors.push('There must be exactly one space after the colon');
      result.corrects.push('^feat: ?$')
    }
  }

  // Check trailing space
  if (title.endsWith(' ')) {
    result.isValid = false;
    result.errors.push('Title must not end with a space');
    result.corrects.push('^feat: hello$')
  }

  // Check ASCII characters
  const nonAsciiRegex = /[^\x20-\x7E]/;
  if (nonAsciiRegex.test(title)) {
    result.isValid = false;
    result.errors.push('Title must only contain displayable ASCII characters (range: 32-126)');
    result.corrects.push('feat: abc-123_$v #@1')
  }

  // Check scope format (if present)
  if (title.includes('(')) {
    const scopeRegex = /^\w+\([a-zA-Z0-9-_]+\):/;
    if (!scopeRegex.test(title)) {
      result.isValid = false;
      result.errors.push('Scope format is incorrect. Scope should only contain letters, numbers, hyphens, and underscores');
      result.corrects.push('feat(good): good')
    }
  }

  return result;
}

async function run() {
  try {
    const context = github.context;
    let titleToCheck: string;

    if (context.payload.pull_request) {
      titleToCheck = context.payload.pull_request.title;
    } else if (context.payload.commits && context.payload.commits.length > 0) {
      titleToCheck = context.payload.commits[0].message.split('\n')[0];
    } else {
      core.setFailed('Unable to get PR title or commit message');
      return;
    }

    const validationResult = validateTitle(titleToCheck);
    
    if (!validationResult.isValid) {
      const errorMessage = [
        `Title "${titleToCheck}" does not conform to the standard.`,
        '',
        'Found the following issues:',
        ...validationResult.errors.map(error => `- ${error}`),
        '',
        'Examples of correct title format:',
        ...validationResult.corrects.map(c => `- ${c}`),
        '',
        'Title Restrictions: The format for a PR (Pull Request) title should follow these rules: <type>(<scope>): <subject>',
        'type and subject are required fields.',
        'scope is optional and can be omitted.',
        'Character Limit: The subject must not exceed 120 characters.',
        'Type Restrictions: the type must be one of the following specified options: feat, fix, docs, style, refactor, test, perf, build, ci, chore, revert',
        'Character Restrictions: the title may only contain ASCII characters; other character sets are not allowed.',
        'Whitespace Rules: the subject must not end with a space; there must be only one space following the `:`'
      ].join('\n');

      core.setFailed(errorMessage);
    } else {
      core.info(`PR title or latest commit message conforms to the standard: ${titleToCheck}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();