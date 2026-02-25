# Select on Combobox (Approach A) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `brn-select` on top of `brn-combobox` to completely reuse the combobox architecture, eliminating the `FocusKeyManager` ARIA bug while reducing duplication.

**Architecture:** We will enhance `brn-combobox` with missing select features (scroll affordances, better value visualization) and then reimplement `brn-select` and `hlm-select` as a thin configuration over the combobox primitives, enforcing `readonly` and `aria-autocomplete="none"`.

**Tech Stack:** Angular v20+, Signals, `@angular/cdk/a11y`, Spartan Brain & Helm

---

### Task 1: Add Scroll Affordances to Combobox

**Files:**
- Create: `libs/brain/combobox/src/lib/brn-combobox-scroll-up.ts`
- Create: `libs/brain/combobox/src/lib/brn-combobox-scroll-down.ts`
- Modify: `libs/brain/combobox/src/index.ts`
- Modify: `libs/brain/combobox/src/lib/brn-combobox-content.ts`

**Step 1: Port Scroll Up Directive**
Create `BrnComboboxScrollUp` similar to `BrnSelectScrollUp`.

**Step 2: Port Scroll Down Directive**
Create `BrnComboboxScrollDown` similar to `BrnSelectScrollDown`.

**Step 3: Export the new directives**
Add them to public API surface in `index.ts`.

---

### Task 2: Standardize Combobox Value Handling for Readonly (Select) Mode

**Files:**
- Modify: `libs/brain/combobox/src/lib/brn-combobox-input.ts`
- Modify: `libs/brain/combobox/src/lib/brn-combobox.ts`

**Step 1: Ensure `brnComboboxInput` honors `readonly` attribute**
When used as a select trigger, the input is functionally readonly. Wait, `brnComboboxInput` already natively accepts `[readonly]="true"`. We must ensure it doesn't open the popup on input if readonly, and uses the selected value string representation even when `search` is empty.

**Step 2: Update `onInput` and `onKeyDown` in `BrnComboboxInput`**
Skip typing processing if `readonly` is set on the actual native element. Note that arrow keys should still open the popup.

---

### Task 3: Complete Multiple-Selection Support for Combobox

**Files:**
- Modify: `libs/brain/combobox/src/lib/brn-combobox-multiple.ts`

**Step 1: Align Value Type**
Ensure `BrnComboboxMultiple` uses a robust array `T[]` format that adequately supports the use cases that `brn-select` needed. Replace any `T[] | null` behavior with proper empty array initialization to match typical select components if necessary.

---

### Task 4: Re-implement `brn-select` over `brn-combobox`

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select.ts`
- Modify: `libs/brain/select/src/lib/brn-select-trigger.ts`
- Modify: `libs/brain/select/src/lib/brn-select-content.ts`
- Modify: `libs/brain/select/src/lib/brn-select-option.ts`

**Step 1: Re-wire components using hostDirectives**
Change `brn-select` structures to compose over `brn-combobox`. For example, `brn-select` can use `hostDirectives: [{ directive: BrnCombobox }]` (or `BrnComboboxMultiple` based on input/DI, or simply become a wrapper).
Since Angular `hostDirectives` don't support dynamic switching between single/multiple combobox directives, we might need to change `BrnSelect` into a factory or rewrite it. If it's too complex to use `hostDirectives`, subclass them or use straightforward wrapper templates.
Alternatively, deprecate the `BrnSelect` components and build the select logic directly in `hlm-select` using `brn-combobox` directives explicitly!

*(Note to engineer: Since the user authorized "I am even ok with this becoming directives if possible", feel free to ruthlessly replace the heavy `brn-select` architecture by directly utilizing `brn-combobox` within `hlm-select` structures if `hostDirectives` mapping proves too tangled.)*

---

### Task 5: Refactor `hlm-select` to Use Combobox Underneath

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select.ts`
- Modify: `libs/helm/select/src/lib/hlm-select-trigger.ts`
- Modify: `libs/helm/select/src/lib/hlm-select-content.ts`

**Step 1: Update Helm Select**
Instead of importing `BrnSelect`, import `BrnCombobox`. Update the hostDirectives and template configuration to provide a select-only combobox experience. The HlmSelect components should leverage `brnCombobox`, `brnComboboxInput` (with `readonly=true`), `brnComboboxContent`, and `brnComboboxItem`.

**Step 2: Ensure correct Trigger ARIA**
The trigger should render an `<input brnComboboxInput hlm aria-autocomplete="none" readonly>` hidden underneath, or styled like a button, or just be a button extending the combobox trigger pattern correctly.

---

### Task 6: Run Tests and Verify

**Files:**
- Test: `libs/brain/select/src/lib/__tests__/*.spec.ts`
- Test: `libs/helm/select/src/lib/__tests__/*.spec.ts`

**Step 1: Run tests**
Run the existing tests to see what broke due to the refactor, and fix them.

```bash
npx nx test brain-select
npx nx test helm-select
```
