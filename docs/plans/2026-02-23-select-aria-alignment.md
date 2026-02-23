# Select ARIA Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the `<button role="combobox">` trigger with `<input readonly role="combobox">` to align BRN Select with the ARIA 1.2 combobox pattern used by `@angular/aria`.

**Architecture:** `BrnSelectTrigger` is updated to apply cleanly to `<input>` elements — removing the `type: 'button'` override and adding dynamic `[attr.readonly]` and `[value]` bindings. `BrnSelect` gains a `displayWith` input and `displayValue` computed signal so the input shows human-readable labels from page load. `HlmSelectTrigger` restructures its template: the host element becomes the styled container and an inner `<input brnSelectTrigger>` replaces the `<button>`. Two open code-review bugs (WebKit scrollbar, double scroll-directive selectors) are fixed in the same pass.

**Tech Stack:** Angular 20+, Angular CDK overlay, `@angular/cdk/a11y` FocusKeyManager, `class-variance-authority`, `jest-preset-angular` / `@testing-library/angular`

---

## Task 1: Fix BrnSelectScrollUp/Down double-selector bug

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select-content.ts:30,57`

The `hlm-select-scroll-*:not(noHlm)` selectors on the BRN scroll directives cause double-application alongside `hostDirectives` in HLM. Remove only the HLM-specific selector parts.

**Step 1: Edit BrnSelectScrollUp selector**

In `brn-select-content.ts` line 30, change:
```typescript
selector: '[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)',
```
to:
```typescript
selector: '[brnSelectScrollUp], brn-select-scroll-up',
```

**Step 2: Edit BrnSelectScrollDown selector**

In `brn-select-content.ts` line 57, change:
```typescript
selector: '[brnSelectScrollDown], brn-select-scroll-down, hlm-select-scroll-down:not(noHlm)',
```
to:
```typescript
selector: '[brnSelectScrollDown], brn-select-scroll-down',
```

**Step 3: Run tests**

```bash
npx nx test brain --testPathPattern="select" --passWithNoTests
```
Expected: all passing (no selector-related failures).

**Step 4: Commit**

```bash
git add libs/brain/select/src/lib/brn-select-content.ts
git commit -m "fix(select): remove hlm selector overlap from BrnSelectScroll directives"
```

---

## Task 2: Fix WebKit scrollbar regression in HlmSelectContent

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-content.ts:23`

Inline `[style]` cannot target pseudo-elements, so `[&::-webkit-scrollbar]:hidden` must be in the Tailwind class string injected via `setViewportClass`.

**Step 1: Update setViewportClass call**

In `hlm-select-content.ts` line 23, change:
```typescript
inject(BrnSelectContent, { optional: true })?.setViewportClass('relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5');
```
to:
```typescript
inject(BrnSelectContent, { optional: true })?.setViewportClass('relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5 [&::-webkit-scrollbar]:hidden');
```

**Step 2: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-content.ts
git commit -m "fix(select): restore WebKit scrollbar hiding in HlmSelectContent viewport"
```

---

## Task 3: Add `readonly` and `displayWith`/`displayValue` to BrnSelect

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select.ts`

**Step 1: Write a failing test for `displayValue` with `displayWith`**

Add to `libs/brain/select/src/lib/__tests__/select-single-mode.spec.ts`, inside the existing `describe('Brn Select Component in single-mode'` block:

```typescript
describe('displayValue with displayWith', () => {
  it('should show label from displayWith before first open', async () => {
    const { fixture } = await render(SelectSingleValueWithInitialValueTest, {
      componentInputs: {
        displayWith: (v: string) => v === 'apple' ? 'Apple' : v,
      },
    });
    const trigger = screen.getByTestId('brn-select-trigger') as HTMLInputElement;
    expect(trigger.value).toBe('Apple');
  });

  it('should show raw value when no displayWith provided and overlay not yet opened', async () => {
    const { fixture } = await render(SelectSingleValueWithInitialValueTest);
    const trigger = screen.getByTestId('brn-select-trigger') as HTMLInputElement;
    // No displayWith + no options registered yet = raw value fallback
    expect(trigger.value).toBe('apple');
  });
});
```

> Note: `SelectSingleValueWithInitialValueTest` needs to expose `displayWith` as a component input — update that fixture in Task 4 alongside the trigger template changes.

**Step 2: Run to confirm failure**

```bash
npx nx test brain --testPathPattern="select-single-mode" --passWithNoTests
```
Expected: FAIL — `displayWith` input does not exist yet.

**Step 3: Add `readonly`, `displayWith`, `displayValue` to `BrnSelect`**

In `brn-select.ts`, add these imports if not already present:
```typescript
import { booleanAttribute } from '@angular/core';
```

After the existing `compareWith` input (around line 85), add:

```typescript
/** Whether the trigger input is read-only. Defaults to true (select pattern). */
public readonly readonly = input(true, { transform: booleanAttribute });

/**
 * Optional function to convert a value to its display string.
 * Use this when your values are objects (e.g. { id, label }) so the trigger
 * input shows the human-readable label from page load without requiring the
 * dropdown to have been opened first.
 *
 * @example
 * [displayWith]="(fruit) => fruit.label"
 */
public readonly displayWith = input<((value: T) => string) | null>(null);

/**
 * The string displayed in the trigger input.
 * Resolution order:
 *   1. displayWith function applied to value (works before first open)
 *   2. Labels from registered selectedOptions (available after first open)
 *   3. Raw value toString() fallback
 */
public readonly displayValue = computed<string>(() => {
  const value = this.value();
  if (value === null || value === undefined) return '';
  if (Array.isArray(value) && value.length === 0) return '';

  const fn = this.displayWith();
  if (fn) {
    return Array.isArray(value)
      ? value.map((v) => fn(v)).join(', ')
      : fn(value as T);
  }

  const labels = this.selectedOptions()
    .map((o) => o.getLabel())
    .filter(Boolean);
  if (labels.length) return labels.join(', ');

  return Array.isArray(value)
    ? (value as T[]).join(', ')
    : String(value ?? '');
});
```

**Step 4: Run tests**

```bash
npx nx test brain --testPathPattern="select-single-mode" --passWithNoTests
```
Expected: the `displayValue` tests now fail only because the trigger template still uses `<button>` — that is fixed in Task 4.

**Step 5: Commit**

```bash
git add libs/brain/select/src/lib/brn-select.ts
git commit -m "feat(select): add readonly, displayWith and displayValue to BrnSelect"
```

---

## Task 4: Update BrnSelectTrigger for input element

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select-trigger.ts`

**Step 1: Remove `type: 'button'`, add `[attr.readonly]`, `[value]`, `[placeholder]`**

Replace the `host` object in `brn-select-trigger.ts`:

```typescript
host: {
  // removed: type: 'button'
  role: 'combobox',
  '[attr.id]': '_triggerId()',
  '[attr.disabled]': '_disabled() || null',
  '[attr.aria-expanded]': '_select.open()',
  '[attr.aria-controls]': '_contentId()',
  '[attr.aria-labelledby]': '_labelledBy()',
  '[attr.aria-autocomplete]': '"none"',
  '[attr.readonly]': '_select.readonly()',
  '[value]': '_select.displayValue()',
  '[attr.placeholder]': '_select.placeholder()',
  '[attr.dir]': '_select.direction()',
  '[class.ng-invalid]': '_ngControl?.invalid || null',
  '[class.ng-dirty]': '_ngControl?.dirty || null',
  '[class.ng-valid]': '_ngControl?.valid || null',
  '[class.ng-touched]': '_ngControl?.touched || null',
  '[class.ng-untouched]': '_ngControl?.untouched || null',
  '[class.ng-pristine]': '_ngControl?.pristine || null',
  '(keydown.ArrowDown)': '_select.show()',
},
```

> Note: `aria-autocomplete` changes from the static string `'none'` to `'"none"'` (expression syntax) to be consistent with the dynamic binding style. Both produce the same output.

**Step 2: Update test fixtures to use `<input brnSelectTrigger>` instead of `<button>`**

In `libs/brain/select/src/lib/__tests__/select-reactive-form.ts`, for every component fixture, change the trigger from:
```html
<button brnSelectTrigger data-testid="brn-select-trigger" ...>
  <brn-select-value data-testid="brn-select-value" />
</button>
```
to:
```html
<input brnSelectTrigger data-testid="brn-select-trigger" ... />
```

Remove `<brn-select-value>` from inside the trigger — its display is now via `[value]` binding on the input.

Also update `libs/brain/select/src/lib/__tests__/brn-select.spec.ts` the same way (the inline template in `setup()`).

**Step 3: Update test assertions from `value.textContent` to `trigger.value`**

In `select-single-mode.spec.ts` and `select-multi-mode.spec.ts`, every assertion like:
```typescript
expect(value.textContent?.trim()).toBe('Apple');
```
becomes:
```typescript
expect((trigger as HTMLInputElement).value).toBe('Apple');
```

And remove the `value: screen.getByTestId('brn-select-value')` from the setup helpers since there is no longer a separate value element.

For the placeholder assertion (showing `DEFAULT_LABEL` when nothing selected), check `trigger.placeholder` or verify the input value is empty:
```typescript
// placeholder is shown natively by the browser; assert value is empty
expect((trigger as HTMLInputElement).value).toBe('');
// and that placeholder attribute is correct
expect(trigger.getAttribute('placeholder')).toBe('Select a Fruit');
```

**Step 4: Run tests**

```bash
npx nx test brain --testPathPattern="select" --passWithNoTests
```
Expected: all passing.

**Step 5: Commit**

```bash
git add libs/brain/select/src/lib/brn-select-trigger.ts \
        libs/brain/select/src/lib/__tests__/
git commit -m "feat(select): change BrnSelectTrigger from button to input, add readonly/value bindings"
```

---

## Task 5: Update HlmSelectTrigger template

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-trigger.ts`

**Step 1: Move CVA classes to host, restructure template**

Replace the entire `HlmSelectTrigger` component with:

```typescript
import { ChangeDetectionStrategy, Component, computed, contentChild, ElementRef, inject, input, AfterViewInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelect, BrnSelectTrigger } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const selectTriggerVariants = cva(
  `border-input [&>ng-icon:not([class*='text-'])]:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>ng-icon]:pointer-events-none [&>ng-icon]:size-4 [&>ng-icon]:shrink-0`,
  {
    variants: {
      error: {
        auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-within:ring-destructive/20 dark:[&.ng-invalid.ng-touched]:focus-within:ring-destructive/40',
        true: 'text-destructive border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
      },
    },
    defaultVariants: {
      error: 'auto',
    },
  },
);

@Component({
  selector: 'hlm-select-trigger',
  imports: [BrnSelectTrigger, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '_computedClass()',
    '[attr.data-size]': 'size()',
  },
  template: `
    <input
      brnSelectTrigger
      class="min-w-0 flex-1 cursor-pointer bg-transparent outline-none"
    />
    @if (_icon()) {
      <ng-content select="ng-icon" />
    } @else {
      <ng-icon hlm size="sm" class="ml-2 flex-none" name="lucideChevronDown" />
    }
  `,
})
export class HlmSelectTrigger implements AfterViewInit {
  protected readonly _icon = contentChild(HlmIcon);
  protected readonly _brnSelect = inject(BrnSelect, { optional: true });
  private readonly _elementRef = inject(ElementRef);

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly size = input<'default' | 'sm'>('default');

  protected readonly _computedClass = computed(() =>
    hlm(selectTriggerVariants({ error: this._brnSelect?.errorState() }), this.userClass()),
  );

  ngAfterViewInit(): void {
    // The host element (hlm-select-trigger) is the full styled container.
    // BrnSelectTrigger measured the inner <input> width, which excludes padding
    // and the icon — so we override triggerWidth with the container's width here.
    if (this._brnSelect) {
      this._brnSelect.triggerWidth.set(this._elementRef.nativeElement.offsetWidth);
    }
  }
}
```

Key changes from the old version:
- `focus-visible:` → `focus-within:` throughout the CVA string (ring fires when inner input is focused)
- `data-[size]` moves from inner button to host via `[attr.data-size]`
- Template: `<input brnSelectTrigger>` + icon, no `<ng-content />` slot for value
- `ngAfterViewInit` overrides `triggerWidth` from the container element (not the inner input)

**Step 2: Run tests (helm has no unit tests for triggers but build must pass)**

```bash
npx nx build helm --skip-nx-cache 2>&1 | tail -20
```
Expected: build succeeds with no errors.

**Step 3: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-trigger.ts
git commit -m "feat(select): restructure HlmSelectTrigger — host is styled container, inner input has brnSelectTrigger"
```

---

## Task 6: Expose `readonly` input through HlmSelect hostDirectives

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select.ts:14`

`HlmSelect` uses `hostDirectives` to forward inputs to `BrnSelect`. Add `readonly` and `displayWith` to the forwarded inputs list.

**Step 1: Update hostDirectives inputs array**

In `hlm-select.ts`, change the `inputs` array inside `hostDirectives`:

```typescript
inputs: [
  'id',
  'multiple',
  'placeholder',
  'disabled',
  'readonly',
  'displayWith',
  'closeDelay',
  'compareWith',
  'open',
  'value',
],
```

**Step 2: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select.ts
git commit -m "feat(select): expose readonly and displayWith inputs through HlmSelect hostDirectives"
```

---

## Task 7: Deprecate HlmSelectValue

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-value.ts`

Add a `@deprecated` JSDoc. Do not remove it yet — kept for backward compatibility.

**Step 1: Add deprecation notice**

At the top of the `HlmSelectValue` class, add:

```typescript
/**
 * @deprecated Value display is now handled by the `<input brnSelectTrigger>` binding.
 * Use `[displayWith]` on `<hlm-select>` for custom label formatting.
 * This component will be removed in a future major version.
 */
@Component({ ... })
export class HlmSelectValue { ... }
```

**Step 2: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-value.ts
git commit -m "deprecate(select): mark HlmSelectValue as deprecated"
```

---

## Task 8: Full test run and verification

**Step 1: Run all select-related tests**

```bash
npx nx test brain --testPathPattern="select" && npx nx build helm --skip-nx-cache
```
Expected: all tests pass, helm builds cleanly.

**Step 2: Manual smoke test (storybook)**

```bash
npx nx storybook ui-storybook
```

Open the Select stories and verify:
- Trigger renders as an `<input>` (inspect in DevTools)
- Placeholder shows when no value selected
- Selected label shows in the input after picking an option
- `displayWith` works: in the story, pre-set a value and confirm it shows the label (not the raw ID) on page load
- Focus ring appears on the `hlm-select-trigger` host when the inner input is focused
- Dropdown width matches trigger width
- Scroll buttons (if present) only appear once (double-selector fix)
- WebKit scrollbar is hidden inside the dropdown

**Step 3: Final commit if any cleanup needed**

```bash
git add -p
git commit -m "chore(select): final cleanup after ARIA alignment"
```

---

## Breaking Changes Summary

Document in `select-breaking-changes.md`:

```markdown
## ARIA Alignment (input trigger)

### Trigger element changed from `<button>` to `<input>`
- Any CSS targeting `hlm-select-trigger button` must be updated
- The trigger is now `<input readonly role="combobox">` inside `<hlm-select-trigger>`

### `<hlm-select-value>` inside `<hlm-select-trigger>` no longer renders
- Remove `<hlm-select-value>` from your trigger template
- For object values, use `[displayWith]="(v) => v.label"` on `<hlm-select>`

### Focus target on open/close changed
- Focus is restored to the `<input>` (not the button) after the dropdown closes

### New inputs on `<hlm-select>`
- `[readonly]` — defaults to `true`; reserved for future searchable combobox
- `[displayWith]` — optional `(value: T) => string` for object values
```
