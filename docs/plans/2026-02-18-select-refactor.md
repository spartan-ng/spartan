# Select Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `HlmSelectImports` the only import consumers need from `@spartan-ng/helm/select`, while ensuring brain components contain zero Tailwind/CSS.

**Architecture:** Dual-selector co-application pattern — `BrnSelect` / `BrnSelectContent` / `BrnSelectValue` already have `hlm-select*` in their selectors, so adding them to `HlmSelectImports` makes them automatically apply when the consumer writes `<hlm-select>` etc. `BrnSelectScrollUp/Down` are `@Directive` and use `hostDirectives` on their HLM counterparts. One Tailwind violation in brain (`BrnSelectContent` viewport div) is fixed by replacing classes with inline styles + a `setViewportClass()` hook.

**Tech Stack:** Angular 20+, Angular CDK overlay/a11y, `@testing-library/angular`, Jest, NX monorepo, Tailwind v4, `class-variance-authority`

> **Finding project names:** Run `npx nx show projects | grep select` to find the exact project names for the test commands below.

---

### Task 1: Fix ARIA casing bugs in brain

These are two incorrect host bindings — HTML attributes are case-insensitive but Angular's `[attr.*]` bindings must be lowercase to be correct and consistent with the rest of the library (`aria-labelledby` not `aria-labelledBy`). Also remove the invalid `aria-controlledBy` attribute (not a real ARIA attribute; `aria-controls` lives on the trigger already).

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select-content.ts:93-94`
- Modify: `libs/brain/select/src/lib/brn-select-trigger.ts:26`

**Step 1: Fix `brn-select-content.ts`**

Find the `host` object. Change:
```typescript
// BEFORE
'[attr.aria-labelledBy]': '_select.labelId()',
'[attr.aria-controlledBy]': "_select.id() +'--trigger'",
```
```typescript
// AFTER — fix case, remove invalid attribute
'[attr.aria-labelledby]': '_select.labelId()',
// aria-controlledBy removed (invalid ARIA attribute; aria-controls is on the trigger)
```

**Step 2: Fix `brn-select-trigger.ts`**

Find the `host` object. Change:
```typescript
// BEFORE
'[attr.aria-labelledBy]': '_labelledBy()',
```
```typescript
// AFTER
'[attr.aria-labelledby]': '_labelledBy()',
```

**Step 3: Run existing brain tests**

```bash
npx nx test <brain-select-project>
```
Expected: All tests pass. If any test asserts `aria-labelledBy` (capital B), update the assertion to `aria-labelledby` (lowercase).

**Step 4: Commit**

```bash
git add libs/brain/select/src/lib/brn-select-content.ts \
        libs/brain/select/src/lib/brn-select-trigger.ts
git commit -m "fix(brain/select): lowercase aria-labelledby host binding, remove invalid aria-controlledBy"
```

---

### Task 2: Remove Tailwind from `BrnSelectContent` viewport div

This is the only Tailwind violation in brain production code for select. The viewport div needs:
- Functional CSS (overflow, scrollbar hiding) → inline `[style]` binding
- Layout CSS (`relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5`) → moved to HLM in Task 3

To allow HLM to inject layout classes, expose a `setViewportClass()` method backed by a signal.

**Files:**
- Modify: `libs/brain/select/src/lib/brn-select-content.ts`

**Step 1: Add the `_viewportClass` signal and `setViewportClass` method**

Inside the `BrnSelectContent` class body, add (near the other signal declarations):
```typescript
/** Layout classes applied by the HLM layer. Not set in BRN directly (BRN = headless). */
private readonly _viewportClass = signal('');

public setViewportClass(cls: string): void {
  this._viewportClass.set(cls);
}
```

**Step 2: Replace the Tailwind classes on the viewport div**

Find the viewport div in the template (around line 109):
```html
<!-- BEFORE -->
<div
  data-brn-select-viewport
  #viewport
  (scroll)="handleScroll()"
  class="relative -mb-0.5 min-h-9 w-full flex-1 overflow-auto pb-0.5 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
>
```
```html
<!-- AFTER — inline styles for functional CSS only, layout class bound to signal -->
<div
  data-brn-select-viewport
  #viewport
  (scroll)="handleScroll()"
  [class]="_viewportClass()"
  [style]="{ overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }"
>
```

**Step 3: Run existing brain tests**

```bash
npx nx test <brain-select-project>
```
Expected: All tests pass. The tests exercise selection, keyboard nav, and form control — none of them assert specific CSS class strings on the viewport div.

**Step 4: Commit**

```bash
git add libs/brain/select/src/lib/brn-select-content.ts
git commit -m "refactor(brain/select): remove tailwind from BrnSelectContent viewport, expose setViewportClass hook"
```

---

### Task 3: Update `HlmSelectContent` — apply viewport layout classes via injection

`HlmSelectContent` is a directive that is co-applied to the same `<hlm-select-content>` element as `BrnSelectContent` (via dual selector). Angular instantiates the component (`BrnSelectContent`) before the directive (`HlmSelectContent`), so `inject(BrnSelectContent)` is safe in the constructor.

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-content.ts`

**Step 1: Read the current file first**

Current content:
```typescript
import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, input } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmSelectContent], hlm-select-content',
  host: {
    '[attr.data-state]': '_stateProvider?.state() ?? "open"',
    '[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
  },
})
export class HlmSelectContent {
  public readonly stickyLabels = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });
  protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
  protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

  constructor() {
    classes(
      () =>
        'border-border bg-popover text-popover-foreground data-[state=open]:animate-in ...',
    );
  }
}
```

**Step 2: Add the injection and viewport class setting**

Add `inject` to the Angular core import and add `BrnSelectContent` import:

```typescript
import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnSelectContent } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmSelectContent], hlm-select-content',
  host: {
    '[attr.data-state]': '_stateProvider?.state() ?? "open"',
    '[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
  },
})
export class HlmSelectContent {
  public readonly stickyLabels = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });
  protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
  protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

  constructor() {
    // Pass layout classes to the BRN viewport div (BRN = headless, HLM owns all styling)
    inject(BrnSelectContent, { optional: true })
      ?.setViewportClass('relative -mb-0.5 min-h-9 w-full flex-1 pb-0.5');

    classes(
      () =>
        'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-full min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md data-[side=bottom]:top-[2px] data-[side=top]:bottom-[2px]',
    );
  }
}
```

**Step 3: Verify visually**

Open Storybook or the app and confirm the select dropdown content still renders correctly with proper scroll behaviour.

**Step 4: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-content.ts
git commit -m "refactor(helm/select): inject BrnSelectContent to apply viewport layout classes from HLM"
```

---

### Task 4: Add `hostDirectives` to `HlmSelectScrollUp` and `HlmSelectScrollDown`

`BrnSelectScrollUp` and `BrnSelectScrollDown` are plain `@Directive` classes (no template). Using `hostDirectives` is the correct pattern — it bundles the brain behavior into the HLM component without requiring it to be in `HlmSelectImports` separately.

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-scroll-up.ts`
- Modify: `libs/helm/select/src/lib/hlm-select-scroll-down.ts`

**Step 1: Update `hlm-select-scroll-up.ts`**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { BrnSelectScrollUp } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
  selector: 'hlm-select-scroll-up',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronUp })],
  hostDirectives: [BrnSelectScrollUp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-icon hlm size="sm" class="ml-2" name="lucideChevronUp" />
  `,
})
export class HlmSelectScrollUp {
  constructor() {
    classes(() => 'flex cursor-default items-center justify-center py-1');
  }
}
```

**Step 2: Update `hlm-select-scroll-down.ts`**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelectScrollDown } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
  selector: 'hlm-select-scroll-down',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronDown })],
  hostDirectives: [BrnSelectScrollDown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-icon hlm size="sm" class="ml-2" name="lucideChevronDown" />
  `,
})
export class HlmSelectScrollDown {
  constructor() {
    classes(() => 'flex cursor-default items-center justify-center py-1');
  }
}
```

> **Note:** Check the current import for `lucideChevronDown` in `hlm-select-scroll-down.ts` before editing — it may use a different icon name. Read the file first to preserve the correct icon.

**Step 3: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-scroll-up.ts \
        libs/helm/select/src/lib/hlm-select-scroll-down.ts
git commit -m "refactor(helm/select): add hostDirectives for BrnSelectScrollUp/Down"
```

---

### Task 5: Clean up `HlmSelectValue` selector

Remove the deprecated mixed pattern `brn-select-value[hlm]` from the selector. After this change `BrnSelectValue` will be applied via its own selector + inclusion in `HlmSelectImports` (Task 6).

**Files:**
- Modify: `libs/helm/select/src/lib/hlm-select-value.ts`

**Step 1: Update the selector**

```typescript
// BEFORE
selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',

// AFTER — remove the mixed pattern
selector: 'hlm-select-value, [hlmSelectValue]',
```

Full file after change:
```typescript
import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: 'hlm-select-value, [hlmSelectValue]',
})
export class HlmSelectValue {
  constructor() {
    classes(() => 'data-[placeholder]:text-muted-foreground line-clamp-1 flex items-center gap-2 truncate');
  }
}
```

**Step 2: Commit**

```bash
git add libs/helm/select/src/lib/hlm-select-value.ts
git commit -m "refactor(helm/select): remove deprecated brn-select-value[hlm] selector from HlmSelectValue"
```

---

### Task 6: Update `HlmSelectImports` and `index.ts`

This is the core fix. Adding the BRN pieces to `HlmSelectImports` means consumers get a single import that covers everything. The dual-selector pattern handles automatic co-application:
- `BrnSelect` selector `'brn-select, hlm-select'` → applies to `<hlm-select>`
- `BrnSelectContent` selector `'brn-select-content, hlm-select-content:not(noHlm)'` → applies to `<hlm-select-content>`
- `BrnSelectValue` selector `'brn-select-value, hlm-select-value'` → applies to `<hlm-select-value>`
- `BrnSelectValueTemplate` + `BrnSelectPlaceholder` → needed for `*brnSelectValue` and custom placeholder templates

**Files:**
- Modify: `libs/helm/select/src/index.ts`

**Step 1: Update `index.ts`**

```typescript
import { BrnSelect, BrnSelectContent, BrnSelectPlaceholder, BrnSelectValue, BrnSelectValueTemplate } from '@spartan-ng/brain/select';
import { HlmSelect } from './lib/hlm-select';
import { HlmSelectContent } from './lib/hlm-select-content';
import { HlmSelectGroup } from './lib/hlm-select-group';
import { HlmSelectLabel } from './lib/hlm-select-label';
import { HlmSelectOption } from './lib/hlm-select-option';
import { HlmSelectScrollDown } from './lib/hlm-select-scroll-down';
import { HlmSelectScrollUp } from './lib/hlm-select-scroll-up';
import { HlmSelectTrigger } from './lib/hlm-select-trigger';
import { HlmSelectValue } from './lib/hlm-select-value';

export * from '@spartan-ng/brain/select';
export * from './lib/hlm-select';
export * from './lib/hlm-select-content';
export * from './lib/hlm-select-group';
export * from './lib/hlm-select-label';
export * from './lib/hlm-select-option';
export * from './lib/hlm-select-scroll-down';
export * from './lib/hlm-select-scroll-up';
export * from './lib/hlm-select-trigger';
export * from './lib/hlm-select-value';

export const HlmSelectImports = [
  // BRN pieces — dual-selector auto-applies these when consumer uses hlm-select elements
  BrnSelect,               // matches <hlm-select> (selector: 'brn-select, hlm-select')
  BrnSelectContent,        // matches <hlm-select-content> (selector: '..., hlm-select-content:not(noHlm)')
  BrnSelectValue,          // matches <hlm-select-value> (selector: 'brn-select-value, hlm-select-value')
  BrnSelectValueTemplate,  // structural directive: *brnSelectValue="let value"
  BrnSelectPlaceholder,    // structural directive: *brnSelectPlaceholder
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

> **Important:** The `export * from '@spartan-ng/brain/select'` line re-exports all brain types so consumers can import token helpers like `injectBrnSelect()` from the helm package if needed. Check whether this creates any circular dependency issues by running a build.

**Step 2: Build to check for errors**

```bash
npx nx build spartan-helm-select
```
Expected: Builds successfully with no errors.

**Step 3: Run brain tests to confirm no regression**

```bash
npx nx test <brain-select-project>
```
Expected: All tests pass.

**Step 4: Commit**

```bash
git add libs/helm/select/src/index.ts
git commit -m "feat(helm/select): make HlmSelectImports self-sufficient — consumers no longer need BrnSelectImports"
```

---

### Task 7: Fix app doc preview files

All four preview files in `apps/app` import `BrnSelectImports` and/or use `<brn-select>` as the root element. After this task, all should import only `HlmSelectImports`.

**Files:**
- Modify: `apps/app/src/app/pages/(components)/components/(select)/select.preview.ts`
- Modify: `apps/app/src/app/pages/(components)/components/(select)/select--multiple.preview.ts`
- Modify: `apps/app/src/app/pages/(components)/components/(select)/select--scrollable.preview.ts`
- Modify: `apps/app/src/app/pages/(components)/components/(select)/select--value-template.preview.ts`

**Step 1: Fix `select.preview.ts`**

```typescript
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'spartan-select-preview',
  imports: [HlmSelectImports],
  template: `
    <hlm-select class="inline-block" placeholder="Select an option">
      <hlm-select-trigger class="w-56">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-option value="Refresh">Refresh</hlm-option>
        <hlm-option value="Settings">Settings</hlm-option>
        <hlm-option value="Help">Help</hlm-option>
        <hlm-option value="Signout">Sign out</hlm-option>
      </hlm-select-content>
    </hlm-select>
  `,
})
export class SelectPreview {}

export const defaultImports = `
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';
`;

export const defaultSkeleton = `
<hlm-select class="inline-block" placeholder="Select an option">
  <hlm-select-trigger class="w-56">
    <hlm-select-value />
  </hlm-select-trigger>
  <hlm-select-content>
    <hlm-option value="Refresh">Refresh</hlm-option>
    <hlm-option value="Settings">Settings</hlm-option>
    <hlm-option value="Help">Help</hlm-option>
    <hlm-option value="Signout">Sign out</hlm-option>
  </hlm-select-content>
</hlm-select>
`;

export const defaultStyles = `
@import '@angular/cdk/overlay-prebuilt.css';
`;
```

**Step 2: Fix `select--multiple.preview.ts`**

```typescript
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'spartan-select-multiple-preview',
  imports: [HlmSelectImports],
  template: `
    <hlm-select class="inline-block" placeholder="Select some fruit" [multiple]="true">
      <hlm-select-trigger class="w-56">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-option value="Apples">Apples</hlm-option>
        <hlm-option value="Bananas">Bananas</hlm-option>
        <hlm-option value="Pears">Pears</hlm-option>
        <hlm-option value="Strawberries">Strawberries</hlm-option>
      </hlm-select-content>
    </hlm-select>
  `,
})
export class SelectMultiplePreview {}
```

> **Note:** The `provideIcons({ lucideChevronUp, lucideChevronDown })` in the original was unnecessary — `HlmSelectTrigger` already provides `lucideChevronDown` internally. Remove it.

**Step 3: Fix `select--scrollable.preview.ts`**

```typescript
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'spartan-select-scrollable-preview',
  imports: [HlmSelectImports],
  template: `
    <hlm-select placeholder="Select a timezone">
      <hlm-select-trigger class="w-[280px]">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content class="max-h-96 min-w-[325px]">
        <hlm-select-scroll-up />

        <hlm-select-group>
          <hlm-select-label>North America</hlm-select-label>
          <hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
          <hlm-option value="cst">Central Standard Time (CST)</hlm-option>
          <hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
          <hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
          <hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
          <hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
        </hlm-select-group>

        <hlm-select-group>
          <hlm-select-label>Europe & Africa</hlm-select-label>
          <hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
          <hlm-option value="cet">Central European Time (CET)</hlm-option>
          <hlm-option value="eet">Eastern European Time (EET)</hlm-option>
          <hlm-option value="west">Western European Summer Time (WEST)</hlm-option>
          <hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
          <hlm-option value="eat">East Africa Time (EAT)</hlm-option>
        </hlm-select-group>

        <hlm-select-group>
          <hlm-select-label>Asia</hlm-select-label>
          <hlm-option value="msk">Moscow Time (MSK)</hlm-option>
          <hlm-option value="ist">India Standard Time (IST)</hlm-option>
          <hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
          <hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
          <hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
          <hlm-option value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-option>
        </hlm-select-group>

        <hlm-select-group>
          <hlm-select-label>Australia & Pacific</hlm-select-label>
          <hlm-option value="awst">Australian Western Standard Time (AWST)</hlm-option>
          <hlm-option value="acst">Australian Central Standard Time (ACST)</hlm-option>
          <hlm-option value="aest">Australian Eastern Standard Time (AEST)</hlm-option>
          <hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
          <hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
        </hlm-select-group>

        <hlm-select-group>
          <hlm-select-label>South America</hlm-select-label>
          <hlm-option value="art">Argentina Time (ART)</hlm-option>
          <hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
          <hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
          <hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
        </hlm-select-group>

        <hlm-select-scroll-down />
      </hlm-select-content>
    </hlm-select>
  `,
})
export class SelectScrollablePreview {}
```

> **Note:** Remove `scrollable="true"` — not a valid input on `hlm-select` (it was silently ignored).

**Step 4: Fix `select--value-template.preview.ts`**

`BrnSelectValueTemplate` (the `*brnSelectValue` structural directive) is now in `HlmSelectImports`, so no separate brain import is needed:

```typescript
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlignCenter,
  lucideAlignJustify,
  lucideAlignLeft,
  lucideAlignRight,
} from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'spartan-select-value-template-preview',
  imports: [HlmSelectImports, NgIcon],
  providers: [
    provideIcons({
      lucideAlignLeft,
      lucideAlignCenter,
      lucideAlignJustify,
      lucideAlignRight,
    }),
  ],
  template: `
    <hlm-select class="inline-block" placeholder="Select an alignment">
      <hlm-select-trigger class="w-56">
        <hlm-select-value>
          <div class="flex items-center gap-x-2" *brnSelectValue="let value">
            <ng-icon [name]="value.icon" />
            {{ value.label }}
          </div>
        </hlm-select-value>
      </hlm-select-trigger>
      <hlm-select-content>
        @for (option of options; track option.label) {
          <hlm-option [value]="option">
            <ng-icon [name]="option.icon" class="mr-2" />
            {{ option.label }}
          </hlm-option>
        }
      </hlm-select-content>
    </hlm-select>
  `,
})
export class SelectValueTemplatePreview {
  public readonly options = [
    { label: 'Align Left', icon: 'lucideAlignLeft' },
    { label: 'Align Center', icon: 'lucideAlignCenter' },
    { label: 'Align Justify', icon: 'lucideAlignJustify' },
    { label: 'Align Right', icon: 'lucideAlignRight' },
  ];
}
```

> **Note:** `lucideChevronUp` and `lucideChevronDown` removed from providers — those are internal to `HlmSelectTrigger`. `NgIcon` is still needed for the alignment icons in the value template.

**Step 5: Build the app to verify no compile errors**

```bash
npx nx build app
```
Expected: Builds with no errors.

**Step 6: Commit**

```bash
git add apps/app/src/app/pages/\(components\)/components/\(select\)/
git commit -m "refactor(app/select): use HlmSelectImports only, replace brn-select root with hlm-select"
```

---

### Task 8: Fix storybook stories

`apps/ui-storybook/stories/select.stories.ts` imports both `BrnSelectImports` and `HlmSelectImports`, and several stories use `<brn-select>` as root or `<brn-select-value hlm />`.

**Files:**
- Modify: `apps/ui-storybook/stories/select.stories.ts`

**Step 1: Update the module-level decorator imports**

```typescript
// BEFORE
imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports, HlmSelectImports, HlmLabel],

// AFTER
imports: [CommonModule, FormsModule, ReactiveFormsModule, HlmSelectImports, HlmLabel],
```

Remove the `BrnSelectImports` import statement at the top of the file.
Remove the `BrnSelectTrigger` named import (it was only used in the `CustomTrigger` story component — keep `BrnSelectTrigger` there if the story demonstrates a custom headless trigger; or update that story to use hlm-only as well).

**Step 2: Replace all `<brn-select>` root usages with `<hlm-select>`**

Find every template that uses `<brn-select ... formControlName="...">` or `<brn-select ... [(ngModel)]="...">` and replace with `<hlm-select>`:
```html
<!-- BEFORE -->
<brn-select class="w-56" formControlName="fruit" ...>

<!-- AFTER -->
<hlm-select class="w-56" formControlName="fruit" ...>
```

**Step 3: Replace all `<brn-select-value hlm />` usages**

```html
<!-- BEFORE -->
<brn-select-value hlm />
<brn-select-value hlm [transformFn]="selectValueTransformFn" />

<!-- AFTER -->
<hlm-select-value />
<hlm-select-value [transformFn]="selectValueTransformFn" />
```

> **Note on `transformFn`:** `BrnSelectValue` has `transformFn = input<...>()`. After adding `BrnSelectValue` to `HlmSelectImports`, it is co-applied to `<hlm-select-value>` via dual-selector. The `[transformFn]` binding on `<hlm-select-value>` is picked up by `BrnSelectValue`'s input since both match the same element. Verify this works at runtime.

**Step 4: Fix the `LabelAndForm` and `DynamicOptionsMultiSelectComponent` inline components**

These components are defined inline in the stories file and import `BrnSelectImports`. Update them:
```typescript
// BEFORE
imports: [FormsModule, ReactiveFormsModule, BrnSelectImports, HlmSelectImports, HlmLabel, HlmButton],

// AFTER
imports: [FormsModule, ReactiveFormsModule, HlmSelectImports, HlmLabel, HlmButton],
```

**Step 5: Handle the `CustomTrigger` story**

The `CustomTrigger` story demonstrates a headless custom trigger using `BrnSelectTrigger` directly. This story intentionally shows brain-level customisation and may legitimately keep its `BrnSelectImports`. Add a comment explaining this is an advanced/headless usage:

```typescript
// CustomSelectTrigger demonstrates advanced headless usage of BrnSelectTrigger.
// Normal usage only requires HlmSelectImports.
imports: [BrnSelectTrigger, NgIcon, HlmIcon],
```

Keep the `BrnSelectTrigger` import for that specific component but remove `BrnSelectImports` from the module-level decorator.

**Step 6: Build storybook to verify no compile errors**

```bash
npx nx build ui-storybook
```
Expected: Builds with no errors.

**Step 7: Commit**

```bash
git add apps/ui-storybook/stories/select.stories.ts
git commit -m "refactor(storybook/select): use HlmSelectImports only, update all story templates to hlm-select root"
```

---

### Task 9: Fix doc meta description and add ARIA reference

**Files:**
- Modify: `apps/app/src/app/pages/(components)/components/(select)/select.page.ts`

**Step 1: Fix the wrong meta description**

```typescript
// BEFORE (copy-pasted from checkbox)
meta: metaWith('spartan/ui - Select', 'A control that allows the user to toggle between checked and not checked.'),

// AFTER
meta: metaWith('spartan/ui - Select', 'Displays a list of options for the user to pick from—triggered by a button.'),
```

**Step 2: Add the ARIA combobox pattern reference**

Find the "About" paragraph in the template:
```html
<!-- BEFORE -->
<p class="${hlmP}">
  Select is built with the help of
  <a href="https://material.angular.dev/cdk/a11y/overview#listkeymanager" ...>ListKeyManager</a>
  and
  <a href="https://material.angular.dev/cdk/overlay/overview" ...>Overlay</a>
  from Material CDK .
</p>
```

```html
<!-- AFTER — fix trailing space before period, add ARIA reference -->
<p class="${hlmP}">
  Select is built with the help of
  <a href="https://material.angular.dev/cdk/a11y/overview#listkeymanager" target="_blank" rel="noreferrer">ListKeyManager</a>
  and
  <a href="https://material.angular.dev/cdk/overlay/overview" target="_blank" rel="noreferrer">Overlay</a>
  from Material CDK, and follows the
  <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noreferrer">ARIA Combobox Pattern</a>.
</p>
```

**Step 3: Commit**

```bash
git add apps/app/src/app/pages/\(components\)/components/\(select\)/select.page.ts
git commit -m "fix(app/select): correct meta description, add ARIA combobox pattern reference"
```

---

### Task 10: Final verification

**Step 1: Run all brain select tests**

```bash
npx nx test <brain-select-project>
```
Expected: All tests pass.

**Step 2: Build the full app**

```bash
npx nx build app
```
Expected: No errors.

**Step 3: Run the full test suite**

```bash
npx nx run-many --target=test --all
```
Expected: No regressions.

**Step 4: Manual checklist**

Open the app/storybook and verify:
- [ ] Basic select renders and works with `<hlm-select>` + only `HlmSelectImports`
- [ ] `formControlName` binding works on `<hlm-select>`
- [ ] `[(ngModel)]` binding works on `<hlm-select>`
- [ ] Multiple select works
- [ ] Scrollable select with scroll-up/down buttons works (scroll logic fires)
- [ ] Custom value template (`*brnSelectValue="let value"`) works
- [ ] Sticky labels work
- [ ] Error state styling shows on invalid touched form control
- [ ] Keyboard navigation (arrow keys, enter, space, home/end) works in dropdown
- [ ] Select closes on backdrop click

**Step 5: Final commit (if any cleanup)**

```bash
git add -p  # stage any remaining changes
git commit -m "chore(select): final cleanup and verification"
```

---

## Consistency Rules Reference

Applied in this PR and to be enforced across the library:

| Rule | Pattern |
|---|---|
| BRN production code | Zero Tailwind, zero `@spartan-ng/helm/*` imports |
| ARIA host bindings | Always lowercase: `[attr.aria-labelledby]` |
| `@Directive` BRN wrapping | `hostDirectives: [BrnXxx]` in HLM component |
| `@Component` BRN wrapping | Dual-selector + include in `HlmXxxImports` |
| Boolean inputs | `input<boolean, BooleanInput>(false, { transform: booleanAttribute })` |
| Number inputs | `input<number, NumberInput>(0, { transform: numberAttribute })` |
| Aria inputs | `ariaLabel = input<string\|null>(null, { alias: 'aria-label' })` |
| Class customization | `userClass = input<ClassValue>('', { alias: 'class' })` |
| Size variants | `'default' \| 'sm'` |
