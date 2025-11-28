# @spartan-ng/helm/field

Secondary entry point of `@spartan-ng/helm`. It can be used by importing from `@spartan-ng/helm/field`.

## Accessibility helpers

The field package now exposes helpers to automatically wire `aria-describedby` from `hlm-field-description` and `hlm-field-error` instances. The `HlmField` directive provides the `HlmFieldA11yService`, `hlm-field-description`/`hlm-field-error` register unique IDs, and the `hlmFieldControlDescribedBy` directive merges those IDs onto focusable controls. To support a new Helm control:

1. Render the control inside an `hlmField` container.
2. Apply `hlmFieldControlDescribedBy` on the focusable native element (or host directive for standalone input-like directives).
3. Let the description and error elements remain siblings inside the field; their IDs are generated automatically if you don't provide one.
4. If you need to expose a custom `aria-describedby`, the directive will merge it with the field-generated IDs.
