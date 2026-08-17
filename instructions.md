# Spartan implementation playbook

Practical workflow for contributors implementing UI and design-system changes.

## Explicit skill references (apply by name)
1. `customize-cloud-agent`
2. `api-contract-safety`
3. `targeted-validation-runner`
4. `repo-conventions-enforcer`

### `api-contract-safety`
- **Trigger:** API shape/schema/error contract changes, or new endpoint integration.
- **Required inputs:** changed contract + all consumer touchpoints.
- **Mandatory checks:** keep typed consumers aligned, document compatibility impact when behavior changes, add targeted contract-facing validation where relevant.
- **Output format:** contract delta + consumer impact summary.
- **Done criteria:** provider/consumer behavior remains aligned and explicit.

### `targeted-validation-runner`
- **Trigger:** any implementation change.
- **Required inputs:** touched files and affected package/app scope.
- **Mandatory checks:** run the smallest relevant lint/test/build commands first; escalate only when needed.
- **Output format:** command list with scope and result.
- **Done criteria:** changed behavior is validated for the impacted surface.

### `repo-conventions-enforcer`
- **Trigger:** any new component/service/pattern usage.
- **Required inputs:** nearest existing Spartan primitives and repo conventions.
- **Mandatory checks:** compose from existing primitives first, keep token usage semantic, avoid duplicated helpers/patterns.
- **Output format:** changed files + reused primitives note.
- **Done criteria:** diff remains system-aligned and convention-consistent.

## 1) Start with references
1. Confirm user goal and affected stories/screens.
2. If AI Elements-related, open the React reference first:
   - https://elements.ai-sdk.dev
   - https://elements.ai-sdk.dev/components/attachments
3. Map requested behavior to existing Spartan primitives before writing new markup/styles.

## 2) Build by composition
1. Prefer existing helm/registry building blocks.
2. Compose larger patterns from existing elements (input group, button, addon, dialog, command, etc.).
3. Use semantic tokens; avoid hardcoded colors/radius/spacing.

## 3) Theme safely
1. Keep light/dark token hierarchy consistent (primary/secondary/tertiary).
2. Validate interactive states in both modes.
3. If changing token values, check all impacted components (not just the current story).

## 4) Parity and divergence
1. Match React AI Elements behavior by default.
2. If Angular constraints force divergence, document:
   - difference,
   - reason,
   - user impact.

## 4.1) Uncertainty escalation (mandatory)
1. If unsure which Spartan primitive/variant maps to requested behavior, pause and state the ambiguity.
2. Propose the closest existing primitives and composition options.
3. Do not introduce a new primitive/variant/pattern until direction is confirmed.

## 4.2) Decision logging
1. For every intentional divergence from AI Elements reference, log:
   - what differs,
   - why it differs,
   - impact on UX/behavior,
   - where it is implemented (file/path).
2. Include this note in the PR description when a PR is created.

## 5) Validation checklist
1. Format and lint.
2. Run targeted tests/build for changed behavior.
3. For Storybook/theme changes, build Storybook and check relevant stories in light/dark.

## 6) Release discipline
1. Do not commit/push/PR unless explicitly instructed.
2. Keep diffs scoped; avoid unrelated file drift.
3. When instructed to create PR, include behavior delta and risk notes.
