# Contributing to Awesome GitHub Profile README

Thank you for helping out! Whether you are submitting a profile, fixing a bug, or adding a feature, this guide will walk you through the setup and rules.

## Table of contents

- [Pull request guidelines](#pull-request-guidelines)
  - [Profile entries (Add, Remove, Update)](#profile-entries-add-remove-update)
  - [Bug fixes and feature improvements](#bug-fixes-and-feature-improvements)
  - [Formatting requirements](#formatting-requirements)
- [Issue guidelines](#issue-guidelines)
  - [Bug reports](#bug-reports)
  - [Feature requests](#feature-requests)

## Pull request guidelines

Profile pull requests that follow these guidelines pass automated validation and merge automatically through GitHub Actions.

### Profile entries (Add, Remove, Update)

1. Fork this repository and clone it locally.
2. Edit `README.md` to update the profile entry:
   - **Add a profile:** Find the category header that fits best. Add your entry in alphabetical order: `- [username](https://github.com/username)`.
     ```diff
       ### Minimalistic

       - [alexmartinfr](https://github.com/alexmartinfr)
     + - [aveek-saha](https://github.com/aveek-saha)
       - [caneco](https://github.com/caneco)
     ```
   - **Remove a profile:** Delete the line containing the username and link.
     ```diff
       ### Minimalistic

       - [alexmartinfr](https://github.com/alexmartinfr)
     - - [aveek-saha](https://github.com/aveek-saha)
       - [caneco](https://github.com/caneco)
     ```
   - **Update a profile:** Move the entry line under the new category header while maintaining alphabetical order. To update the website preview, delete `[username].webp` from `site/static/screenshots/`.
     ```diff
       ### Dynamic

       - [andyruwruw](https://github.com/andyruwruw)
     + - [aveek-saha](https://github.com/aveek-saha)
       - [daniakash](https://github.com/daniakash)

       ### Minimalistic

       - [alexmartinfr](https://github.com/alexmartinfr)
     - - [aveek-saha](https://github.com/aveek-saha)
       - [caneco](https://github.com/caneco)
     ```
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`.
   - Allowed types: `add`, `update`, `remove`, `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
   - Example commit message:
     ```bash
     git commit -m "add(profile): Aveek-Saha to Minimalistic category"
     ```
4. Push to your fork and submit a pull request.

### Bug fixes and feature improvements

1. Fork this repository and clone it locally.
2. Create a branch named after your change (`fix/preview-generator`, `feat/search-filter`).
3. Make your changes and commit with a clear Conventional Commit message.
4. Submit a pull request targeting the `main` branch.

### Formatting requirements

- Check spelling and grammar before pushing.
- Configure your editor to trim trailing whitespace. Prettier is recommended.
- Keep each pull request focused on a single change.

## Issue guidelines

Before opening a new issue, search existing issues to avoid duplicates.

### Bug reports

When submitting a bug report, include:

- A clear summary of the issue.
- Expected behavior vs actual result.
- Steps to reproduce, screenshots, and browser/OS details if applicable.

### Feature requests

When submitting a feature request, include:

- A summary of the proposed feature and why it helps.
- Mockups, screenshots, or examples from other projects if available.

---

If you get stuck during setup or have questions about category placement, open a [discussion or issue](https://github.com/roypriyanshu02/awesome-github-profile-readme/issues).
