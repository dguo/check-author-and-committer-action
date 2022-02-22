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

        const authorEmailRegex = core.getInput("author-email-regex");
        checkField({
            field: "author email",
            regex: authorEmailRegex,
            value: commit.author.email
        });

        const authorNameRegex = core.getInput("author-name-regex");
        checkField({
            field: "author name",
            regex: authorNameRegex,
            value: commit.author.name
        });

        const committerEmailRegex = core.getInput("committer-email-regex");
        checkField({
            field: "committer email",
            regex: committerEmailRegex,
            value: commit.committer.email
        });

        const committerNameRegex = core.getInput("committer-name-regex");
        checkField({
            field: "committer name",
            regex: committerNameRegex,
            value: commit.committer.name
        });
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run();
