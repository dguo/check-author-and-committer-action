# Check Author and Committer Action

GitHub Action to check that the name and/or email for an author or committer
matches a specified regex.

This example checks that the commit's author has an email sending in
`@example.com`.

```yaml
uses: dguo/check-author-and-committer@main
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  author-email-regex: '@example\.com$'
```

This example allows for an `@example.com` or an `@users.noreply.github.com`
email (for those who [keep their personal email address
private](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/setting-your-commit-email-address#about-commit-email-addresses)).

```yaml
uses: dguo/check-author-and-committer@main
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  author-email-regex: '@example\.com$|@users\.noreply\.github\.com$'
```

Git [does distinguish](https://stackoverflow.com/q/18750808/1481479) between the
author and committer for a commit. They are the same person for many cases, but
there are cases where it [makes sense for them to be
different](https://ivan.bessarabov.com/blog/git-author-committer).
