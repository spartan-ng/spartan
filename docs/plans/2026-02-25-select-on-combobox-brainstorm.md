# Brainstorm: Rebuilding brn-select on top of brn-combobox

**Date:** 2026-02-25
**Topic:** Should brn-select adopt the Angular ARIA combobox+listbox pattern by reusing brn-combobox as its foundation?

---

## Context

The Angular ARIA authoring practices (WAI-ARIA APG) define a **select-only combobox** as a combobox where the input is readonly and `aria-autocomplete="none"` — the user cannot type to filter, only navigate and select. This is identical in structure to what `brn-select` implements, but there is a subtle and important divergence in how the current implementation manages focus.

The question is whether `brn-select` should be rebuilt on top of `brn-combobox` to align with this pattern.

---

## Current Architecture Gap

### brn-select (current)

| Aspect | Current behaviour |
|---|---|
| Trigger ARIA | `role="combobox"`, `aria-haspopup="listbox"`, `aria-autocomplete="none"` ✓ |
| Focus management | `FocusKeyManager` → **physically moves DOM focus into the listbox items** |
| Key manager | `FocusKeyManager` |
| `aria-activedescendant` | Not set on the trigger |
| Overlay | CDK overlay (directly, via positions config) |
| Value type | `T \| T[]` (multiple is first-class) |
| Display value | Complex `displayValue` computed (displayWith, label scan, fallback) |

### brn-combobox (current)

| Aspect | Current behaviour |
|---|---|
| Trigger ARIA | `role="combobox"`, `aria-haspopup="listbox"`, `aria-autocomplete="list"` ✓ |
| Focus management | `ActiveDescendantKeyManager` → **focus stays in the input, uses `aria-activedescendant`** |
| Key manager | `ActiveDescendantKeyManager` |
| `aria-activedescendant` | Managed via key manager ✓ |
| Overlay | `BrnPopover` abstraction |
| Value type | `T \| null` (multiple via `BrnComboboxMultiple` subclass) |
| Display value | `itemToString` function |

### The ARIA Problem

The WAI-ARIA combobox pattern requires focus to remain on the combobox element (the trigger input) at all times. Navigation within the popup is communicated via `aria-activedescendant` pointing to the highlighted option's `id`. Moving focus into the listbox items (what `FocusKeyManager` does) violates this pattern and confuses screen readers that expect focus on the combobox input.

`brn-combobox` does this correctly. `brn-select` does not.

---

## Three Approaches

### Approach A — Full unification: brn-select becomes a readonly brn-combobox

`brn-select` would be reimplemented as a thin configuration layer over `brn-combobox`:
- Trigger: `brnComboboxInput` with `readonly=true`, `aria-autocomplete="none"`, no filter
- No search input in the popup panel
- Default filter is `() => true` (show everything always)
- Multiple mode reuses `BrnComboboxMultiple`

**Pros:**
- Single implementation for both patterns — select is just a constrained combobox
- Inherits correct `ActiveDescendantKeyManager` ARIA for free
- Future features (virtual scroll, async loading) land once and work everywhere
- The ARIA relationship is explicit and spec-compliant

**Cons:**
- `BrnComboboxMultiple` value type is `T[] | null`, not the `T | T[]` that brn-select uses — migration effort
- `brn-combobox` doesn't have scroll-up/scroll-down button affordances (BrnSelectScrollUp/Down)
- Overlay moves from CDK overlay directly to BrnPopover — additional indirection
- HLM templates for `hlm-select` would need reworking
- `displayValue` computation logic is more nuanced than `itemToString`

**Rating:** High long-term payoff, high short-term cost.

---

### Approach B — Fix brn-select's ARIA in place, keep it independent

Keep `brn-select` as a separate component but switch from `FocusKeyManager` to `ActiveDescendantKeyManager` in `BrnSelectContent`, and wire `aria-activedescendant` on the trigger.

- `BrnSelectContent` gets `ActiveDescendantKeyManager` instead of `FocusKeyManager`
- `BrnSelectTrigger` gets `[attr.aria-activedescendant]` pointing to the active option
- Focus stays in the trigger during keyboard navigation
- No structural changes to the API or templates

**Pros:**
- Minimal change, no migration required
- Fixes the core ARIA problem immediately
- Preserves all existing select-specific features (scroll buttons, `T | T[]` value, displayValue)

**Cons:**
- Still two separate implementations with diverging capabilities
- Doesn't address the architectural duplication
- brn-select will need to catch up to brn-combobox features independently over time

**Rating:** Low cost, immediately fixes the ARIA violation. Does not close the duplication gap.

---

### Approach C — Extract a shared BrnListboxBase

Extract common selection logic (option registration, value tracking, `compareWith`, multi-select) into a shared abstract base or mixin. Both `brn-select` and `brn-combobox` compose from this base while owning their own overlay and trigger logic.

**Pros:**
- Reduces duplication without forcing full unification
- Each component can evolve independently where they differ

**Cons:**
- Angular doesn't have great multiple-inheritance / mixin support — the "base" becomes another injection token
- Adds a new abstraction layer without user-visible benefit
- Risk of the base becoming a lowest-common-denominator that serves neither well

**Rating:** Appealing in theory, complex in practice for Angular's DI model.

---

## Recommendation

**Short term: Approach B** — fix the `FocusKeyManager` → `ActiveDescendantKeyManager` switch in `brn-select`. This is the single most impactful ARIA improvement and unblocks screen reader users without any API changes.

**Long term: Approach A** — treat the fully unified combobox+listbox as the canonical implementation. A select-only combobox is literally:
```
brnCombobox + brnComboboxInput[readonly] + aria-autocomplete="none" + no filter input
```
Once the multiple-mode value type (T[] vs T[] | null) and the scroll button story are resolved, the merge becomes straightforward.

---

## Key Open Questions Before Committing to A

1. **Value type unification** — can `BrnComboboxMultiple` adopt `T[]` (non-nullable) to match brn-select's multiple model?
2. **Scroll buttons** — should `brn-combobox` grow scroll-up/scroll-down affordances, or are they only needed for select?
3. **displayValue vs itemToString** — brn-select's `displayValue` handles the "options not yet registered" case (useful when content is in a CDK overlay portal). Does brn-combobox need this?
4. **HLM template impact** — how much does `hlm-select` change if it is restructured around `brnCombobox`?

---

## Summary

The Angular ARIA combobox+listbox pattern is the right foundation for `brn-select`. The `brn-combobox` implementation is already more ARIA-correct than `brn-select` because it uses `ActiveDescendantKeyManager` and keeps focus in the trigger. The immediate fix is to adopt that key manager in `brn-select`. The longer-term play is to unify them so a "select" is just a readonly combobox — which is what the spec says it should be.

---

## Final Decision (2026-02-25)

**Decision:** Skip the short-term fix (Approach B) and proceed directly with **Approach A: Full Unification**.

**Answers to Open Questions:**
1. **Value type:** Yes, we will adopt the `BrnComboboxMultiple` value handling.
2. **Scroll buttons:** Yes, we will implement the scrolling affordances in the combobox list so they are available for both combobox and select.
3. **displayValue vs itemToString:** We will rely on the combobox's logic for display; if it works for combobox, it will work for select.
4. **HLM Template Impact:** Breaking changes are acceptable. Converting the components to primitives/directives in HLM is an acceptable outcome.

An implementation plan has been written to `docs/plans/2026-02-25-select-on-combobox-implementation.md`.
