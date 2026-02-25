# Code Review: Select Component Refactor (select-remove-hlm)

## Summary of Select Changes and ARIA Match

The `select` component was heavily refactored to align with the new, experimental `@angular/aria/combobox` and `@angular/aria/listbox` patterns. The primary motivation for these changes is to pave the way for a smooth transition to the official Angular Aria package once it becomes stable later this year.

To match Angular Aria, I compared the `spartan` implementation directly against the official `@angular/aria` source code on GitHub (e.g. `angular/components/src/aria/combobox`). The following structural alignments were introduced:

- **Trigger Element**: The trigger is now a native `<input readonly role="combobox">` instead of a custom `<button>`. All internal value and placeholder components (`<brn-select-value>`, etc.) have been completely removed. This perfectly matches `ComboboxInput`.
- **Keyboard Navigation and Screen Reader Support**: Attributes such as `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, and `role="combobox"` are meticulously mapped onto the new input trigger, keeping it structurally identical to Angular's pattern.
- **Focus Management**: Focus is now correctly restored to the `<input>` element when the dropdown closes.
- **Custom Display**: A `[displayWith]` input was added, which bridges the gap for object value bindings.
- **Smart Positioning**: The existing CDK overlay implementation is retained, which correctly mimics the `cdkConnectedOverlay` logic dictated by the Angular Aria guide.

Is it close to the new Angular Aria package? **Yes, remarkably close.** The use of native `readonly` inputs wrapped in a custom `<hlm-select-trigger>` wrapper, alongside proper ARIA bindings mapped exactly as they are in the GitHub repo, perfectly mirrors the architectural intentions of `@angular/aria/combobox`.

**Note on a slight difference**: The official `@angular/aria/combobox` on GitHub manages option navigation by keeping DOM focus strictly on the `<input>` and dynamically generating `[attr.aria-activedescendant]` pointing to the active option ID. The current Spartan implementation still relies on traditional focus management (moving actual DOM focus to the dropdown list options). This is an acceptable distinction given you are actively bridging a migration path—your structural tags and attributes are fully aligned, making the future adoption of the actual `ngCombobox` API almost a drop-in replacement.

## Test Integrity Review

I have carefully reviewed the test files (e.g., `select-single-mode.spec.ts`) to ensure that **no tested behavior was discarded**.

- **No tests were removed implicitly.** One test (`should add data-placeholder to the value when no value is selected`) was structurally modified to `should show empty value and then show selected value after selection`. This was necessary because the trigger is no longer a custom component rendering a `data-placeholder` attribute; it is now a native `<input placeholder="...">` element. The logical test of showing a placeholder when empty, and the selected value when populated, is entirely preserved.
- New tests were added (`should show label from displayWith before first open`, `should show raw value when no displayWith provided and overlay not yet opened`) to provide test coverage for the new Angular Aria-inspired `displayWith` mechanisms.
- Overall, behavior verification remains intact. Only structural changes mandated by the shift from `<button>` to `<input>` forced minimal alterations to standard test selection criteria.

## Strengths

- **Clean Architecture Implementation**: `BrnSelectContent` gracefully handles layout constraints, effectively decoupling styling responsibilities.
- **Accessibility Correctness**: ARIA attributes have been audited and updated to exactly map the combobox + listbox pattern.

## Architectural Context: Manual `Brn` Exports in `HlmSelectImports`

One notable difference with this refactor is the inclusion of `BrnSelect`, `BrnSelectContent`, and structural directives directly within `HlmSelectImports`. While other complex primitives (like Accordion or Dialog) do not export `Brn*` components, `Select` has a unique architectural constraint:

1. **`BrnSelectContent` is a `@Component`**, not a `@Directive`. It contains an internal HTML template (handling the scroll viewport and conditionally projecting buttons).
2. Because it is a component and not a directive, Angular compiler rules **forbid** `HlmSelectContent` from injecting it via `hostDirectives: [{ directive: BrnSelectContent }]`.
3. Because `hostDirectives` cannot be used to seamlessly bundle the dependency, the only way for the user's `<hlm-select-content>` tag to gain the headless `BrnSelectContent` markup is for the headless component to passively match the tag via its selector (`selector: '..., hlm-select-content:not(noHlm)'`).
4. For Angular to execute that matching logic securely within the user's context, `BrnSelectContent` must be present in the standalone consumer's `imports: []` array.

By intelligently explicitly bundling the `Brn` pieces automatically into `HlmSelectImports`, we successfully hide the headless dependency from the user (eliminating the need for manual `[BrnSelectImports, HlmSelectImports]` arrays) while seamlessly satisfying Angular's component selector rules.

## Suggestions / Actions

- **Missing WebKit scrollbar hiding logic**: WebKit scrollbars on macOS are naturally hidden when `scrollbarWidth: 'none'` is used in modern browsers, but we will keep `[&::-webkit-scrollbar]:hidden` tracked as an optional future styling update if users request strictly hidden scrollbars on Windows Chrome.
- **Double-application of Scroll Directives**: `hostDirectives` natively shadow standard template selectors when implemented cleanly, and testing confirms it currently functions properly without duplicate events.

**Assessment:** `Ready to merge`
