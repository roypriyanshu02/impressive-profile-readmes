## Description

Please include a clear summary of the changes introduced in this PR and the motivation behind them. If this PR resolves an existing issue, reference it here (e.g., `Fixes #123`).

## Type of Change

- [ ] Profile entry change (Add, Remove, or Update a profile)
- [ ] Bug fix (non-breaking change which fixes an issue in gallery site, scripts, or workflows)
- [ ] New feature (non-breaking change which adds functionality to live gallery or tooling)
- [ ] Documentation update (updates to `README.md`, `CONTRIBUTING.md`, or templates)

## Checklist

### Profile Entries (Add, Remove, Update)

- [ ] **Add:** Added profile under the appropriate category header in alphabetical order (`- [username](https://github.com/username)`).
- [ ] **Remove:** Deleted the line containing username and link.
- [ ] **Update:** Moved entry under the new category header in alphabetical order (and deleted `[username].webp` from `site/static/screenshots/` if updating website preview).
- [ ] Committed changes using [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `add(profile): username to Category`, `update(profile): ...`, `remove(profile): ...`).
- [ ] Kept PR focused on a single change.

### Bug Fixes & Feature Improvements (if modifying `site/` or scripts)

- [ ] Created a branch named after the change (e.g., `fix/preview-generator`, `feat/search-filter`).
- [ ] Performed a self-review of code changes and tested locally (`npm run dev` or `npm run build` in `site/`).
- [ ] Confirmed formatting, spelling, and lint checks pass without errors.

### Verification & CI Checks

- [ ] Verified profile README is active, public, and visually appealing.
- [ ] Verified automated link check and CI workflows pass.
