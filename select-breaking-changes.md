# Breaking Changes: Select Component Refactor

The `select` component has been refactored to simplify the API, unify styling across the headless/ui boundaries, and reduce boilerplate.

## For `spartan/ui` (Helm) Users

If you are using the pre-styled `hlm-select` components, here are the breaking changes you need to address:

1. **Simplified Imports**: 
   You no longer need to import both `BrnSelectImports` and `HlmSelectImports`. `HlmSelectImports` now bundles everything needed.
   ```typescript
   // ❌ BEFORE
   imports: [BrnSelectImports, HlmSelectImports]
   
   // ✅ AFTER
   imports: [HlmSelectImports]
   ```

2. **Root Element Selector**: 
   The root component should now be explicitly `<hlm-select>` instead of `<brn-select>`.
   ```html
   <!-- ❌ BEFORE -->
   <brn-select class="w-56"> 
   
   <!-- ✅ AFTER -->
   <hlm-select class="w-56">
   ```

3. **Value Selector**:
   The syntax for using the styled select value has changed. The `HlmSelectValue` directive no longer matches `brn-select-value[hlm]`. You must use the HTML tag `<hlm-select-value>`.
   ```html
   <!-- ❌ BEFORE -->
   <brn-select-value hlm />
   
   <!-- ✅ AFTER -->
   <hlm-select-value />
   ```

4. **Trigger Structure**:
   Ensure you are using `<hlm-select-trigger>` consistently without mixing `[brnSelectTrigger]` into standard UI implementations unless you are building a completely custom headless trigger.

## For `@spartan-ng/brain` (Headless) Users

If you are building your own UI components directly on top of `@spartan-ng/brain-select`, note the following changes:

1. **Styling Injection Shift**:
   `BrnSelectContent` now relies heavily on a viewport wrapper `div` element inside its template. The styling of this viewport was completely extracted from `brain` into `helm` using an injection mechanism (`setViewportClass('...')`). If you are directly using `BrnSelectContent` without `HlmSelectContent`, your dropdown will be missing flexbox, width, and overflow utilities previously hardcoded in the BRN layer. You will need to style the viewport manually via the new `setViewportClass` API.

2. **Scroll Directives via `hostDirectives`**:
   The headless scroll behaviors (`BrnSelectScrollUp` and `BrnSelectScrollDown`) are now meant to be exposed primarily via Angular's `hostDirectives` API on your custom wrapper components, rather than solely relying on template selectors. 

## Migration Steps Summary
Search your project for `<brn-select` and `<brn-select-value hlm` and replace them with `<hlm-select` and `<hlm-select-value` respectively. Finally, remove any leftover `BrnSelectImports` arrays from your component architectures when `HlmSelectImports` is already present.
