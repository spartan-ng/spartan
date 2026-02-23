# Select ARIA Alignment Design

**Date:** 2026-02-23
**Branch:** `select-remove-hlm`
**Context:** Follow-up to the select directive refactor (2026-02-18). Aligns `BrnSelectTrigger` to the ARIA 1.2 combobox pattern used by `@angular/aria` (`angular/components`).

---

## Goal

Replace the `<button role="combobox">` trigger pattern with `<input readonly role="combobox">`, matching the Angular ARIA team's approach. A select is a read-only combobox — one ARIA primitive, `readonly=true` is what makes it a select rather than a searchable combobox.

---

## Reference: `@angular/aria` Pattern

Source: `angular/components` → `src/aria/combobox/combobox-input.ts`

```typescript
host: {
  'role': 'combobox',
  '[value]': 'value()',
  '[attr.readonly]': 'combobox._pattern.readonly()',   // dynamic, not static
  '[attr.aria-disabled]': 'combobox._pattern.disabled()',
  '[attr.aria-expanded]': 'combobox._pattern.expanded()',
  '[attr.aria-activedescendant]': 'combobox._pattern.activeDescendant()',
  '[attr.aria-controls]': 'combobox._pattern.popupId()',
  '[attr.aria-haspopup]': 'combobox._pattern.hasPopup()',
  '[attr.aria-autocomplete]': 'combobox._pattern.autocomplete()',
}
```

Key observations:
- `readonly` is a **dynamic** `[attr.readonly]` binding, not a static attribute
- `[value]` is bound to a signal — the input displays the selected label text
- `aria-activedescendant` is present (deferred for BRN — see Out of Scope)

---

## Section 1: BRN Changes

### 1.1 `BrnSelectTrigger`

- Remove `type: 'button'` host binding — the directive is no longer button-specific
- Add `'[attr.readonly]': '_select.readonly()'` — dynamic binding, matches Angular ARIA
- Add `'[value]': '_select.displayValue()'` — input displays selected label text
- Add `'[placeholder]': '_select.placeholder()'` — native input placeholder when nothing selected
- All existing ARIA host bindings (`role`, `aria-expanded`, `aria-controls`, `aria-labelledby`, `aria-autocomplete`) remain unchanged

### 1.2 `BrnSelect` — add `readonly`, `displayWith`, `displayValue`

```typescript
/** Whether the trigger input is read-only. Defaults to true (select pattern). */
readonly = input(true, { transform: booleanAttribute });

/** Optional fn to convert a value to its display label. Use when values are objects. */
displayWith = input<((value: T) => string) | null>(null);

/** The string shown in the trigger input. */
displayValue = computed(() => {
  const value = this.value();
  if (!value || (Array.isArray(value) && !value.length)) return '';

  const fn = this.displayWith();
  if (fn) return Array.isArray(value) ? value.map(fn).join(', ') : fn(value);

  // Once overlay has opened, selectedOptions provides human-readable labels.
  const labels = this.selectedOptions().map(o => o.getLabel()).filter(Boolean);
  if (labels.length) return labels.join(', ');

  // Fallback: raw value as string (shown before first open when no displayWith provided).
  return Array.isArray(value) ? value.join(', ') : String(value ?? '');
});
```

`displayWith` mirrors Angular Material's API. Consumers with string values don't need it.
Consumers with object values (e.g. `{ id, label }`) provide it once and the input shows
the correct label from page load — fixing the initial value regression.

### 1.3 Fix open code review issues

**Double-application of scroll directives** (`select-remove-hlm-review.md` issue #2):
- Remove `hlm-select-scroll-up:not(noHlm)` and `hlm-select-scroll-down:not(noHlm)` from
  `BrnSelectScrollUp` / `BrnSelectScrollDown` selectors — `hostDirectives` in HLM already handles application

**WebKit scrollbar regression** (`select-remove-hlm-review.md` issue #1 minor):
- Add `[&::-webkit-scrollbar]:hidden` back to the viewport class string injected by `HlmSelectContent`

---

## Section 2: HLM Changes

### 2.1 `HlmSelectTrigger` — host becomes styled container

`<input>` is a void element; the chevron icon cannot be a child of it. The
`hlm-select-trigger` host element becomes the styled container:

```
<hlm-select-trigger>        ← host: border, bg, flex, rounded, height (CVA classes)
  <input brnSelectTrigger>  ← transparent, flex-1, no border/outline, fills space
  <ng-icon chevronDown />   ← sibling to input
</hlm-select-trigger>
```

CSS changes:
- CVA container classes move to the host via `[class]` host binding
- Replace `focus-visible:` classes with `focus-within:` — the host shows the ring when
  the inner input is focused
- `<ng-content />` (for `<hlm-select-value>`) is removed — value is shown via `[value]` binding

### 2.2 Fix `triggerWidth` measurement

`BrnSelectTrigger` measures its own `offsetWidth` to populate `BrnSelect.triggerWidth`
(used for overlay width). When `brnSelectTrigger` is on the inner `<input>`, that width
excludes the icon and container padding — making the dropdown too narrow.

Fix: `HlmSelectTrigger` injects `BrnSelect` and overrides `triggerWidth` from its own
host `ElementRef` after view init, replacing what `BrnSelectTrigger` measured.

### 2.3 Deprecate `HlmSelectValue`

`HlmSelectValue` is kept in the codebase for backward compatibility but marked
`@deprecated`. Consumers should migrate to `[displayWith]` on `<hlm-select>`.

---

## Section 3: Breaking Changes

| What changes | Consumer impact |
|---|---|
| Trigger is `<input>` not `<button>` | CSS selectors targeting `hlm-select-trigger button` break |
| `<hlm-select-value>` inside trigger no longer renders | Custom value templates must migrate to `[displayWith]` |
| Focus goes to `<input>` on open/close restore | Code relying on button focus breaks |
| Object values need `[displayWith]` to show labels before first open | Same regression as current branch — now fixable |

---

## Out of Scope (Deferred)

- `aria-activedescendant` + keeping focus on the input during keyboard navigation
  (currently `FocusKeyManager` moves DOM focus to options — aligning this is a separate PR)
- Merging `brn-select` into a unified `brn-combobox` primitive with `readonly=false` support
- Searchable/filterable combobox mode
- Other components needing similar ARIA alignment (accordion, dialog, etc.)
