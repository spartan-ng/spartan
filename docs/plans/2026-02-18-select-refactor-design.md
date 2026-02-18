# Select Refactor Design

**Date:** 2026-02-18
**Branch:** `select-remove-hlm`
**References:** PR #890 (polish imports), PR #1208 (slider polish)

---

## Goal

Consumers of the library should only need to import `HlmSelectImports` from `@spartan-ng/helm/select`. Importing `BrnSelectImports` must never be required.

---

## Guiding Principle: BRN = Radix, HLM = shadcn

| Layer | Responsibility | Forbidden |
|---|---|---|
| **BRN** (brain) | Behavior, a11y, keyboard nav, form control, CDK wiring | Any CSS, Tailwind classes, HLM imports |
| **HLM** (helm) | All visual concerns, styling, icon composition | Duplicating BRN logic |
| **Consumer** | Imports `HlmSelectImports` only | Importing from `@spartan-ng/brain/*` for normal use |

This mirrors the Radix UI → shadcn/ui relationship.

---

## Architecture: Dual-Selector Co-application

`BrnSelect` and `BrnSelectContent` remain as `@Component` (they have CDK overlay templates that cannot be separated cleanly). The dual-selector pattern handles automatic co-application:

- `BrnSelect` selector: `'brn-select, hlm-select'` — applies to `<hlm-select>` automatically
- `BrnSelectContent` selector: `'brn-select-content, hlm-select-content:not(noHlm)'` — applies to `<hlm-select-content>` automatically
- `BrnSelectValue` selector: `'brn-select-value, hlm-select-value'` — applies to `<hlm-select-value>` automatically

The fix: include the missing BRN components in `HlmSelectImports` so consumers get everything from a single import.

For `BrnSelectScrollUp/Down` (already `@Directive`): use `hostDirectives` on the HLM components — no need to add to `HlmSelectImports` directly.

---

## Section 1: Brain Changes

### 1.1 Remove Tailwind from `brn-select-content.ts`

**The only Tailwind violation in brain production code for select.**

Current viewport div class string:
```
class="relative -mb-0.5 min-h-9 w-full flex-1 overflow-auto pb-0.5
       [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]
       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
```

Changes:
- Replace with `[style]` inline binding for functional CSS only:
  `{ overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }`
- Layout classes (`relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5`) move to HLM
- Expose `setViewportClass(cls: string): void` method (backed by a `signal<string>`) so HLM can inject and set the layout classes
- Drop `[-webkit-overflow-scrolling:touch]` (deprecated in modern iOS)
- Drop `[&::-webkit-scrollbar]:hidden` (covered by `scrollbar-width: none` in modern browsers)

### 1.2 Fix ARIA casing bugs

| File | Current (wrong) | Fixed |
|---|---|---|
| `brn-select-content.ts:93` | `[attr.aria-labelledBy]` | `[attr.aria-labelledby]` |
| `brn-select-trigger.ts:26` | `[attr.aria-labelledBy]` | `[attr.aria-labelledby]` |
| `brn-select-content.ts:94` | `[attr.aria-controlledBy]` | Remove (invalid ARIA attribute; trigger already has `aria-controls`) |

---

## Section 2: Helm Changes

### 2.1 Update `HlmSelectImports`

```typescript
export const HlmSelectImports = [
  // BRN pieces — dual-selector matching requires these in consumer's imports
  BrnSelect,               // 'brn-select, hlm-select'
  BrnSelectContent,        // 'brn-select-content, hlm-select-content:not(noHlm)'
  BrnSelectValue,          // 'brn-select-value, hlm-select-value'
  BrnSelectValueTemplate,  // <ng-template brnSelectValueTemplate>
  BrnSelectPlaceholder,    // <ng-template brnSelectPlaceholder>
  // HLM styling components
  HlmSelect,
  HlmSelectContent,
  HlmSelectTrigger,
  HlmSelectOption,
  HlmSelectValue,
  HlmSelectScrollUp,
  HlmSelectScrollDown,
  HlmSelectLabel,
  HlmSelectGroup,
] as const;
```

Also add the corresponding `export *` lines to `index.ts` for the newly re-exported BRN types.

### 2.2 Update `HlmSelectContent`

Inject `BrnSelectContent` and apply the layout classes that were removed from BRN:

```typescript
constructor() {
  inject(BrnSelectContent, { optional: true })
    ?.setViewportClass('relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5');
  classes(() => '...existing classes...');
}
```

### 2.3 Update `HlmSelectScrollUp` / `HlmSelectScrollDown`

`BrnSelectScrollUp/Down` are already `@Directive` — use `hostDirectives`:

```typescript
// hlm-select-scroll-up.ts
@Component({
  hostDirectives: [BrnSelectScrollUp],
  ...
})

// hlm-select-scroll-down.ts
@Component({
  hostDirectives: [BrnSelectScrollDown],
  ...
})
```

### 2.4 Clean up `HlmSelectValue` selector

Remove the deprecated mixed pattern:

```typescript
// Before: 'hlm-select-value, [hlmSelectValue], brn-select-value[hlm]'
// After:  'hlm-select-value, [hlmSelectValue]'
```

`BrnSelectValue` applies via its own dual selector + inclusion in `HlmSelectImports`.

---

## Section 3: IO Naming Consistency Rules

These rules apply library-wide and must be followed in this refactor.

| Pattern | Rule |
|---|---|
| Boolean inputs | `booleanAttribute` transform, typed `input<boolean, BooleanInput>` |
| Number inputs | `numberAttribute` transform, typed `input<number, NumberInput>` |
| Aria inputs | camelCase property, dash-case alias: `ariaLabel = input(null, { alias: 'aria-label' })` |
| ARIA host bindings | Always lowercase HTML attribute: `[attr.aria-labelledby]` never `[attr.aria-labelledBy]` |
| Two-way bindable state | `model()` signal |
| Class customization on leaf components | `userClass = input<ClassValue>('', { alias: 'class' })` |
| Size variants | `'default' \| 'sm'` enum |

**Select-specific note:** `BrnSelect` has no `ariaLabel`/`ariaLabelledby` input. This is correct — a composite select uses content-projected `<label hlmLabel>` for labelling, not a direct aria-label attribute.

---

## Section 4: Exports Audit

**`libs/brain/select/src/index.ts`** — no changes needed.

**`libs/helm/select/src/index.ts`** — add `export *` re-exports for:
- `BrnSelectValueTemplate`
- `BrnSelectPlaceholder`
- `BrnSelectValue`
- `BrnSelectContent`
- `BrnSelect`

(These are re-exported from helm so consumers only need `@spartan-ng/helm/select`.)

---

## Section 5: Form Control Compatibility

No structural changes needed. `BrnSelect` already implements `ControlValueAccessor` + `BrnFormFieldControl`. Adding `BrnSelect` to `HlmSelectImports` is sufficient — the dual selector ensures it applies to `<hlm-select>`, and all form control bindings continue to work:

```html
<hlm-select formControlName="fruit">...</hlm-select>
<hlm-select [(ngModel)]="fruit" name="fruit">...</hlm-select>
<hlm-select [formControl]="ctrl">...</hlm-select>
```

---

## Section 6: Documentation & Examples

### 6.1 Meta description bug

`select.page.ts:25` — wrong copy-pasted description from checkbox:
```
// Before: 'A control that allows the user to toggle between checked and not checked.'
// After:  'Displays a list of options for the user to pick from—triggered by a button.'
```

### 6.2 All preview/story templates

Replace the mixed pattern with hlm-only usage everywhere:

| Current | Replace with |
|---|---|
| `<brn-select>` as root | `<hlm-select>` |
| `import { BrnSelectImports }` | Remove; only `HlmSelectImports` needed |
| `<brn-select-value hlm />` | `<hlm-select-value />` |

Files to update:
- `apps/app/src/app/pages/(components)/components/(select)/select.preview.ts`
  - Component template
  - `defaultImports` export string
  - `defaultSkeleton` export string
- `apps/app/src/app/pages/(components)/components/(select)/select--multiple.preview.ts`
- `apps/app/src/app/pages/(components)/components/(select)/select--scrollable.preview.ts`
- `apps/app/src/app/pages/(components)/components/(select)/select--value-template.preview.ts`
- `apps/ui-storybook/stories/select.stories.ts` — remove `BrnSelectImports`, update all story templates

### 6.3 Add missing third-party reference

Add to the "About" section of `select.page.ts`:

```html
<a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noreferrer">
  ARIA Combobox Pattern
</a>
```

---

## Section 7: Consistency Checklist

Before marking this PR complete, verify:

- [ ] `libs/brain/select` has zero Tailwind classes in production source
- [ ] `libs/brain/select` has zero imports from `@spartan-ng/helm/*`
- [ ] `HlmSelectImports` is sufficient for all consumer use cases (template, reactive forms, ngModel, form-field)
- [ ] All story/preview files import only `HlmSelectImports` from select
- [ ] All story/preview templates use `<hlm-select>` as root
- [ ] `<hlm-select-value />` used consistently (no `<brn-select-value hlm />`)
- [ ] ARIA host binding attributes are lowercase (`aria-labelledby` not `aria-labelledBy`)
- [ ] Doc meta description is correct
- [ ] ARIA combobox pattern link added to docs
- [ ] All public exports from `libs/helm/select/src/index.ts` are correct

---

## Out of Scope

- Converting `BrnSelect` / `BrnSelectContent` from `@Component` to `@Directive` (deferred — would require calendar-style full template ownership in HLM and is a larger breaking change)
- `brn-radio.ts` Tailwind violation (separate PR)
- Other components needing the same treatment (accordion, dialog, etc.)
