# Breaking Changes: Select Component Refactor

The `select` component has been refactored to simplify the API, unify styling across the headless/ui boundaries, and radically improve ARIA compliance by aligning with the upcoming `@angular/aria` package.

## ARIA Alignment & Structural Revisions

We wanted to closely match the new **Angular Aria** package (`@angular/aria/select`) so we can seamlessly switch to the official package once we only support Angular v21 later this year. To achieve this structural parity, the following breaking changes were introduced:

1. **Trigger Element Changed (`<button>` to `<input>`)**
   - The trigger is now an `<input readonly role="combobox">` instead of a custom `<button>` element.
   - Any custom CSS targeting `hlm-select-trigger button` will break and must be updated to target the `input`.

2. **Deprecated Value and Template Components Removed**
   - `<brn-select-value>`, `<hlm-select-value>`, `<brn-select-value-template>`, and `<brn-select-placeholder>` have been completely removed.
   - Remove these entirely from all your select trigger templates. The `<input>` inherently handles value and placeholder display natively.
   - To display complex objects, use the new `[displayWith]="(v) => v.label"` input property directly on `<hlm-select>`.

3. **Focus Target on Open/Close Changed**
   - Focus is now strictly restored and attached to the `<input>` element (and not a wrapper button) when the dropdown panel closes.

4. **New Inputs on `<hlm-select>`**
   - `[readonly]` — Defaults to `true`; reserved for future searchable combobox support.
   - `[displayWith]` — Accepts a `(value: T) => string` method for mapping object values to the input string before the overlay lists render.

## For `spartan/ui` (Helm) Users

If you are using the pre-styled `hlm-select` components:

1. **Simplified Imports**:
   You no longer need to import both `BrnSelectImports` and `HlmSelectImports`. `HlmSelectImports` structurally provides everything needed.

   ```typescript
   // ❌ BEFORE
   imports: [BrnSelectImports, HlmSelectImports];

   // ✅ AFTER
   imports: [HlmSelectImports];
   ```

2. **Root Element Selector**:
   The root component should now be explicitly `<hlm-select>` instead of `<brn-select>`.

   ```html
   <!-- ❌ BEFORE -->
   <brn-select class="w-56">
   	<!-- ✅ AFTER -->
   	<hlm-select class="w-56"></hlm-select>
   </brn-select>
   ```

3. **Trigger Structure**:
   Ensure you are using `<hlm-select-trigger>` consistently without mixing `[brnSelectTrigger]` into standard UI implementations unless you are building a completely custom headless trigger.

## For `@spartan-ng/brain` (Headless) Users

1. **Styling Injection Shift**:
   `BrnSelectContent` now relies heavily on a viewport wrapper `div` element inside its template. The styling of this viewport was completely extracted from `brain` into `helm` using an injection mechanism (`setViewportClass('...')`). If you use `BrnSelectContent` directly, you must provide viewport classes (flexbox, overflow) manually.

2. **Scroll Directives via `hostDirectives`**:
   The headless scroll behaviors (`BrnSelectScrollUp` and `BrnSelectScrollDown`) are now heavily optimized for Angular's `hostDirectives` API.

## Migration Steps Summary

1. Find and replace all `<brn-select>` root tags with `<hlm-select>`.
2. Delete **all** instances of `<brn-select-value>`, `<hlm-select-value>`, and `<brn-select-value-template>` from underneath your `<hlm-select-trigger>`.
3. If you were using those value templates to map complex objects to display strings, use the new `[displayWith]="(item) => item.name"` property on `<hlm-select>` instead.
4. Remove `BrnSelectImports` from your `@Component` imports array. `HlmSelectImports` structurally provides everything you need automatically.
