# Contributing

spartan is an MIT-licensed open source project with its ongoing development made by contributors.

## Contributing to the UI library

### Folder structure

Source code for the UI primitives exists under the `libs/brain` and `libs/helm` folders. To contribute features or bug fixes to the project,
locate the relevant code in one of these sub-folders.

### Setup

spartan uses [PNPM](https://pnpm.io) to manage its dependencies.

Before opening a pull request, run the following command from the root
folder to make sure your development dependencies are up-to-date:

```shell
pnpm install
```

### Running locally

When working on UI primitives you most likely want to work with our storybook. To start storybook
you can simply run and go to http://localhost:4400:

```shell
pnpm run storybook
```

### Build

spartan uses [Nx](https://nx.dev) for builds. To build all projects locally, run the following command from the root
folder:

```shell
pnpm run build
```

### Testing

spartan uses [Jest](https://jestjs.io) for tests. To test all projects locally, run the following command from the root
folder:

```shell
pnpm run test
```

We also have e2e tests set up with Cypress that run against our storybook. Run them with:

```shell
pnpm run e2e
```

## Contributing to the docs and spartan website

To serve the documentation and example application locally, run the following command from the root folder:

```shell
pnpm run dev
```

The code is inside `apps/app` and runs on AnalogJs.

## Creating a new Brain feature

Brain features should be added as a secondary entrypoint to the `brain` library. This can be done by running the following
command:

```shell
nx g @spartan-ng/tools:brain-secondary-entrypoint --name=feature-name
```

## Creating a new Helm feature

Helm features should be added as a secondary entrypoint to the `helm` library. This can be done by running the following
command:

```shell
nx g @spartan-ng/tools:helm-secondary-entrypoint --name=feature-name
```

## Submitting pull requests

**Please follow these basic steps to simplify pull request reviews. If you don't you'll probably just be asked to
anyway.**

- Please rebase your branch against the current master.
- Run the `Setup` command to make sure your development dependencies are up-to-date.
- Please ensure the test suite passes before submitting a PR.
- If you've added new functionality, **please** include tests which validate its behavior.
- Make reference to possible [issues](https://github.com/spartan-ng/spartan/issues) on PR comment.

## Submitting bug reports

- Search through issues to see if a previous issue has already been reported and/or fixed.
- Provide a _small_ reproduction using a [StackBlitz project](https://stackblitz.com) or a GitHub repository.
- Please detail the affected browser(s) and operating system(s).
- Please be sure to state which version of Angular, node and npm you're using.

## Submitting new features

- We value keeping the API surface small and concise, which factors into whether new features are accepted.
- Submit an issue with the prefix `RFC:` with your feature request.
- The feature will be discussed and considered.
- Once the PR is submitted, it will be reviewed and merged once approved.

## Questions and requests for support

Questions and requests for support should not be opened as issues and should be handled in the following ways:

- Start a new [Q&A Discussion](https://github.com/spartan-ng/spartan/discussions/new?category=q-a) on GitHub.

## Commit message guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the changelog**.

### Commit message format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain
a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/spartan-ng/spartan/commits/main))

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated
from commit messages.

The following is the list of supported scopes:

#### Primitives

- **accordion**
- **alert**
- **alert-dialog**
- **aspect-ratio**
- **avatar**
- **badge**
- **breadcrumb**
- **button**
- **calendar**
- **card**
- **carousel**
- **checkbox**
- **collapsible**
- **combobox**
- **command**
- **context-menu**
- **data-table**
- **date-picker**
- **dialog**
- **dropdown-menu**
- **form-field**
- **hover-card**
- **icon**
- **input**
- **input-otp**
- **label**
- **menubar**
- **navigation-menu**
- **pagination**
- **popover**
- **progress**
- **radio-group**
- **scroll-area**
- **select**
- **separator**
- **sheet**
- **skeleton**
- **slider**
- **sonner**
- **spinner**
- **switch**
- **table**
- **tabs**
- **textarea**
- **toggle**
- **toggle-group**
- **tooltip**
- **typography**

#### And others

- **trpc**
- **nx**
- **repo**
- **cli**

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit
message is then used for this.

Example:

```
feat(scope): commit message

BREAKING CHANGES:

Describe breaking changes here

BEFORE:

Previous code example here

AFTER:

New code example here
```
