import * as core from "@actions/core";
import * as github from "@actions/github";

export function checkField({
    field,
    regex,
    value
}: {
    regex: string;
    field: string;
    value: string;
}) {
    if (regex && !new RegExp(regex).test(value)) {
        throw new Error(
            `The ${field} (${value}) does not match the regex: ${regex}`
        );
    }
}

async function run(): Promise<void> {
    try {
        const authorEmailRegex = core.getInput("author-email-regex");
        const authorNameRegex = core.getInput("author-name-regex");
        const committerEmailRegex = core.getInput("committer-email-regex");
        const committerNameRegex = core.getInput("committer-name-regex");
        if (
            !authorEmailRegex &&
            !authorNameRegex &&
            !committerEmailRegex &&
            !committerNameRegex
        ) {
            throw new Error(
                "No regexes were provided. Consider removing this action if you don't need it."
            );
        }

        /* We can't use the the context's SHA for pull rqueset events because it
           represents a merge commit rather than the latest commit.
           https://github.community/t/github-sha-isnt-the-value-expected/17903
           */
        const commitSha =
            github.context.payload.pull_request?.head.sha ?? github.context.sha;

        if (commitSha) {
            core.info(`Using commit SHA: ${commitSha}`);
        } else {
            core.debug(`GitHub context: ${JSON.stringify(github.context)}`);
            throw new Error("Failed to get the commit SHA");
        }

        const githubToken = core.getInput("github-token");
        const octokit = github.getOctokit(githubToken);
        const {data: commit} = await octokit.rest.git.getCommit({
            commit_sha: commitSha,
            owner: github.context.repo.owner,
            repo: github.context.repo.repo
        });

        core.info(`Author email: ${commit.author.email}`);
        core.info(`Author name: ${commit.author.name}`);
        core.info(`Committer email: ${commit.committer.email}`);
        core.info(`Committer name: ${commit.committer.name}`);

        checkField({
            field: "author email",
            regex: authorEmailRegex,
            value: commit.author.email
        });
        checkField({
            field: "author name",
            regex: authorNameRegex,
            value: commit.author.name
        });
        checkField({
            field: "committer email",
            regex: committerEmailRegex,
            value: commit.committer.email
        });
        checkField({
            field: "committer name",
            regex: committerNameRegex,
            value: commit.committer.name
        });
    } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (error instanceof Object) {
            errorMessage = error.toString();
        } else {
            errorMessage = "Unexpected error";
        }

        const customErrorMessage = core.getInput("custom-error-message");
        if (customErrorMessage) {
            errorMessage += `\n${customErrorMessage}`;
        }

        core.setFailed(errorMessage);
    }
}

run();
