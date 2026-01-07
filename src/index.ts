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

import * as core from '@actions/core';
import * as github from '@actions/github';
import { ConventionalCommitValidator } from './validator';

async function run() {
  try {
    // Get the strict mode setting (default: true)
    const strictMode = core.getInput('strict') !== 'false';

    // Get the max description length (default: 50)
    const maxDescriptionLengthInput = core.getInput('max_description_length');
    const maxDescriptionLength = maxDescriptionLengthInput
      ? parseInt(maxDescriptionLengthInput, 10)
      : 50;

    // Validate the max description length
    if (isNaN(maxDescriptionLength) || maxDescriptionLength <= 0) {
      core.setFailed('max_description_length must be a positive number');
      return;
    }

    // Get the title to check
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

    core.info(`Checking title: "${titleToCheck}"`);

    // Validate the title
    const validator = new ConventionalCommitValidator({
      strict: strictMode,
      maxDescriptionLength: maxDescriptionLength,
    });
    const result = validator.validate(titleToCheck);

    if (!result.isValid) {
      // Build error message
      const errorLines = [
        `❌ Title "${titleToCheck}" does not conform to Conventional Commits specification.`,
        '',
        '📋 Found the following issues:',
        '',
      ];

      result.errors.forEach((error, index) => {
        errorLines.push(`${index + 1}. ${error.message}`);
        if (error.example) {
          errorLines.push(`   Example: ${error.example}`);
        }
        errorLines.push('');
      });

      errorLines.push('');
      errorLines.push('📖 Format Requirements:');
      errorLines.push('');
      errorLines.push('   <type>[optional scope][optional !]: <description>');
      errorLines.push('');
      errorLines.push('   • type: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert');
      errorLines.push('   • scope: optional, lowercase letters/numbers/hyphens/underscores only');
      errorLines.push('   • !: optional breaking change marker (placed after scope, before colon)');
      errorLines.push(`   • description: required, max ${maxDescriptionLength} characters`);

      if (strictMode) {
        errorLines.push('');
        errorLines.push('⚙️  Strict mode is enabled:');
        errorLines.push('   • Description must start with lowercase letter');
        errorLines.push('   • Description must not end with a period');
        errorLines.push('   • Description should use imperative mood (e.g., "add" not "added")');
      }

      errorLines.push('');
      errorLines.push('✅ Valid examples:');
      errorLines.push('   • feat: add user authentication');
      errorLines.push('   • fix(api): resolve timeout issue');
      errorLines.push('   • docs(readme): update installation steps');
      errorLines.push('   • feat(api)!: breaking change in API');
      errorLines.push('');
      errorLines.push('📚 Learn more: https://www.conventionalcommits.org/');

      core.setFailed(errorLines.join('\n'));
    } else {
      core.info(`✅ Title conforms to Conventional Commits specification`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Unexpected error: ${error.message}`);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
