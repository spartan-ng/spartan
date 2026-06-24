# v1 Release Readiness — TODO

Moving from cron-driven nightly alpha bumps to **semver + semantic-release** with `alpha`/`beta`
prereleases, GitHub Releases, and npm publishing for `@spartan-ng/brain`, `@spartan-ng/cli`, and
`@spartan-ng/mcp`.

Channel model: `main → latest`, `beta → beta`, `alpha → alpha`.

---

## Already done in code (no action needed — listed so you know what changed)

- [x] **Package metadata hygiene** — added missing `license`/`publishConfig.access` to brain and
      normalized `repository.url` on brain/cli/mcp. Provenance is enabled via `NPM_CONFIG_PROVENANCE`
      in the release workflow (not `publishConfig`, which would also force it on local/verdaccio
      publishes like cli-smoke and fail without an OIDC id-token). _Why: a public v1 needs a license,
      public access, and provenance for a trustworthy npm listing._
- [x] **`@spartan-ng/helm` made private** (`private: true`, version `0.0.0`). _Why: helm ships via the
      CLI registry, not as a package; this prevents accidental publishing and signals it's unreleased._
- [x] **Rewrote `release.config.mjs`** for semantic-release (main/beta/alpha channels, correct
      plugins, fixed asset paths, GitHub Releases). _Why: the old config was stale and broken — it
      referenced a nonexistent script and wrong file paths and never ran._
- [x] **`npm-publish` executor**: empty `TAG` (the stable/main channel) now defaults to `latest`.
      _Why: semantic-release passes the channel as the dist-tag, and stable has an empty channel._
- [x] **New `.github/workflows/release.yml`** (push to main/beta/alpha + manual dry-run) and
      **deleted `nightly-release.yml`**. _Why: releases are now push-driven per channel, not nightly._
- [x] **Release is gated on a `verify` stage** (lint + build + unit test brain/cli/mcp + cli-smoke)
      that must pass before publishing; skipped on dry-runs. _Why: semantic-release tags before it
      publishes, so an unchecked failure could leave a tag with no npm release — verify fails fast
      before any tag. e2e is intentionally excluded: it covers Storybook/the unpublished UI surface
      and is already run by `ci.yml` on every PR._
- [x] **Wired the release GitHub App token** into the workflow (bypass actor for branch/tag rulesets).
      _Why: lets semantic-release push the release commit + create the `v*` tag through a non-human
      identity even with protection enabled._
- [x] **Removed dead code** — nightly scripts, the `auto-increment-version` generator, and helm's old
      release target/version block. _Why: leaving dead release paths around invites accidental use._
- [x] **Installed `@semantic-release/github`.** _Why: it creates the git tag + GitHub Release + notes._

---

## Manual steps to do (in order)

### 1. Repoint npm trusted publishing to the new workflow filename

- [x] On npmjs.com, for **each** package (`@spartan-ng/brain`, `@spartan-ng/cli`, `@spartan-ng/mcp`),
      update the trusted publisher config to reference **`release.yml`** (was `nightly-release.yml`).

> Why: npm trusted publishing (OIDC) pins the exact workflow filename. The filename changed, so the
> first publish from `release.yml` will be **rejected** until this is updated.

### 2. Create the prerelease branches

- [x] Create `beta` from `main`: `git branch beta main && git push origin beta`
- [x] Confirm `alpha` exists (it does) and is based off recent `main`.

> Why: semantic-release maps each branch to a channel/dist-tag. The `beta` and `alpha` branches must
> exist for prerelease publishing to work. `main` stays the default branch.

### 3. Protect the release branches

- [x] Add a ruleset (or extend the existing `main` one) covering `main`, `beta`, `alpha` that blocks
      **deletion** and **force-pushes**.
- [x] _(Recommended)_ Add **"Require status checks to pass"** (`commitlint`, `format-and-lint`, `build`,
      `unit`) + **"Require a pull request"** (1 approval) to the same ruleset, with the release App on
      the bypass list.

> Why: release branches carry tags and the published history; deleting or rewriting them would corrupt
> the version lineage semantic-release relies on. Requiring CI checks means nothing unvalidated
> (failing unit/e2e/build) can ever reach a release branch — making the in-workflow `verify` gate a
> fail-fast backstop rather than the only line of defense.

### 4. (Required) Add a GitHub App for the release token

`release.yml` always mints its token via `actions/create-github-app-token` from `APP_ID` /
`APP_PRIVATE_KEY`, so the App must exist or the release job fails at the first step. It also doubles
as the bypass actor once you **require pull requests or status checks** on `main` (the default
`GITHUB_TOKEN` cannot be a bypass actor).

- [x] Create a GitHub App in the org with **Contents: Read & write** (add **Pull requests** + **Issues:
      Read & write** if you keep semantic-release's release comments). No webhook.
- [x] Install it on `spartan-ng/spartan`.
- [x] Add repo secrets `APP_ID` and `APP_PRIVATE_KEY`.
- [x] Add the App as a **bypass actor** on the `main` ruleset (and any required-PR rule).
- [x] Wire `actions/create-github-app-token` into `release.yml` (mints the token, feeds it to checkout + the release step as `GITHUB_TOKEN`).

> Why: requiring PRs/checks blocks **all** direct pushes — including semantic-release's — and the
> default `GITHUB_TOKEN` cannot be a bypass actor. The App provides a bypass identity without a
> personal token.

### 5. (Optional) Protect release tags

- [x] Add a **tag ruleset** for `v*` to restrict who can create/move release tags. If you restrict tag
      **creation**, add the release identity (App or token) to its bypass list.

> Why: prevents humans from hand-creating `v*` tags that would confuse semantic-release's "last
> release" detection. Skip the creation-restriction if you're still on `GITHUB_TOKEN`, or it'll block
> the release.

### 6. Safe first release (1.0.0)

`workflow_dispatch` only works once `release.yml` is on `main`, but merging it with the `push:` trigger
active would fire a real release on the merge commit. So for the first cutover:

- [x] Merge `release.yml` with the **`push:` trigger temporarily removed** (dispatch-only). _Why: lets
      the workflow land on `main` without auto-publishing._ (Done on `chore/semantic-release-v1`: the
      `push:` block is commented out; re-enabled in step 7 after the first release.)
- [x] Dry-run: `gh workflow run release.yml --ref main -f dry-run=true` then `gh run watch`. _Why:
      confirm it computes **1.0.0** and the right files/notes before anything is published._
- [x] Real release: `gh workflow run release.yml --ref main -f dry-run=false`. _Why: publishes 1.0.0 to
      npm `latest`, commits the version bump + changelog, and cuts the GitHub Release._
- [x] Verify: `@spartan-ng/*@1.0.0` on npm, a `v1.0.0` tag, and a GitHub Release. _Done: npm
      brain/cli/mcp@1.0.0, tag `v1.0.0`, and the GitHub Release (created manually — semantic-release's
      release-body POST 422'd on the >125k-char first-release changelog; future releases are small)._

> Why this sequence: it lets you preview the computed version with zero risk before the irreversible
> npm publish.

### 7. Enable ongoing automation

- [x] Follow-up PR that **re-adds `push: [main, beta, alpha]`** to `release.yml`.

> Why: after the verified first release, every merge to a release branch should publish automatically —
> that's the whole point of the channel model.

### 8. (Optional) Test the prerelease channels

- [ ] Merge a `feat:` commit into `beta` → expect `x.y.z-beta.1` on the `beta` dist-tag + a prerelease
      GitHub Release. Repeat on `alpha`.

> Why: validates that beta/alpha publish to the correct dist-tags before you rely on them.

---

## Notes / gotchas

- **Conventional commits drive the version.** `feat:` → minor, `fix:` → patch, `BREAKING CHANGE`/`!`
  → major. commitlint already enforces the format. Hidden types (docs/style/perf/test) don't trigger
  releases.
- **Provenance is CI-only.** It's enabled via `NPM_CONFIG_PROVENANCE=true` in `release.yml`, where the
  OIDC id-token exists. It is deliberately NOT in `publishConfig`, because that would force provenance
  on every publish — including cli-smoke's local verdaccio publish, which has no id-token and fails.
  Publishing for real should only happen via `release.yml`.
- **No infinite loops.** The release commit carries `[skip ci]`, and commits pushed by Actions don't
  re-trigger `release.yml`.
