# Check Author and Committer Action

This action (for [GitHub Actions](https://github.com/features/actions)) checks
that the email address and/or name for the commit's author and/or committer
matches specified regexes. For example, you might want to ensure that committers
use their organization email addresses rather than their personal email
addresses.

testing

## Usage

This example checks that the committer has an email ending in
`@example.com`.

```yaml
name: Check committer email
on:
  push:
    branches:
      - main
  pull_request:
jobs:
  check-commit-author:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dguo/check-author-and-committer-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          committer-email-regex: '@example\.com$'
```

This example allows for an `@example.com` or an `@users.noreply.github.com`
email (for those who [keep their personal email address
private](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/setting-your-commit-email-address#about-commit-email-addresses)).

```yaml
- uses: dguo/check-author-and-committer-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    committer-email-regex: '@example\.com$|@users\.noreply\.github\.com$'
```

### Custom Error Message

You can provide a `custom-error-message` for when a check fails. This can be
useful for providing context, such as by linking to documentation that explains
what the committer needs to do.

```yaml
- uses: dguo/check-author-and-committer-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    custom-error-message: 'See https://example.com/internal-docs/setting-your-git-config'
    committer-email-regex: '@example\.com$'
```

### All Inputs

```yaml
- uses: dguo/check-author-and-committer-action@v1
  with:
    # (Required) GitHub token to use for API calls
    github-token: ${{ secrets.GITHUB_TOKEN }}
    # (Optional) Custom error message to provide additional context or information
    custom-error-message: ''
    # (Optional) JavaScript regex to validate the author's email address
    author-email-regex: ''
    # (Optional) JavaScript regex to validate the author's name
    author-name-regex: ''
    # (Optional) JavaScript regex to validate the committer's email address
    committer-email-regex: ''
    # (Optional) JavaScript regex to validate the committer's name
    committer-name-regex: ''
```

## Author vs. Committer

Git [does distinguish](https://stackoverflow.com/q/18750808/1481479) between the
author and committer for a commit. They are frequently the same person, but
there are cases where it [makes sense for them to be
different](https://ivan.bessarabov.com/blog/git-author-committer).

## License

MIT
