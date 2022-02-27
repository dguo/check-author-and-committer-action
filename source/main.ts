import * as core from "@actions/core";
import * as github from "@actions/github";
import {
    PushEvent,
    PullRequestSynchronizeEvent
} from "@octokit/webhooks-definitions/schema";

function checkField({
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

        let commitSha;
        if (
            github.context.eventName === "push" ||
            github.context.eventName === "pull_request"
        ) {
            const githubEvent = github.context.payload as
                | PushEvent
                | PullRequestSynchronizeEvent;
            commitSha = githubEvent.after;
        } else {
            throw new Error("Unexpected GitHub event");
        }

        const githubToken = core.getInput("github-token");
        const octokit = github.getOctokit(githubToken);
        const {data: commit} = await octokit.rest.git.getCommit({
            commit_sha: commitSha,
            owner: github.context.repo.owner,
            repo: github.context.repo.repo
        });

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
