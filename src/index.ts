import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const context = github.context;
    let titleToCheck: string;

    if (context.payload.pull_request) {
      // check pull request title
      titleToCheck = context.payload.pull_request.title;
    } else if (context.payload.commits && context.payload.commits.length > 0) {
      // if not pull request, check latest commit message
      titleToCheck = context.payload.commits[0].message.split('\n')[0];
    } else {
      core.setFailed('unable to get pull request title or commit message');
      return;
    }

    const titleRegex = new RegExp(core.getInput('pattern'));
    if (!titleRegex.test(titleToCheck)) {
      core.setFailed(
        "Pull request title or latest commit message does not conform to the standard. " +
        "Please use the format: <type>(<scope>): <subject>\n\n" +
        "The <type> can be: feat, fix, docs, style, refactor, test, pref, build, ci, chore or revert\n\n" +
        "There must be exactly one space after the colon, and no space is allowed at the end of the title.\n\n" +
        "Only displayable ASCII characters are allowed in the title. " +
        "The displayable character number range is 32-126 (0x20-0x7E), a total of 95 characters"
      );
    } else {
      core.info(`pull request title or latest commit message conforms to the standard`);
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