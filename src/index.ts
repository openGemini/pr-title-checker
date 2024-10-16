import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const regexPattern = core.getInput('regex-pattern');

    const { context } = github;
    const title = context.payload.pull_request?.title;
    
    if (!title) {
      core.setFailed('Unable to get PR title');
      return;
    }

    const regex = new RegExp(regexPattern);

    if (!regex.test(title)) {
      core.setFailed('PR title does not conform to the standard. Please use the format: <type>(<scope>): <subject>\n\nthe <type> can be: feat, fix, docs, style, refactor, test, pref, build, ci, chore or revert');
    } else {
      core.info('PR title conforms to the standard');
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
