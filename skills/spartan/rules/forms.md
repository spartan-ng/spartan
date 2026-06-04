# Forms and inputs

spartan/ui composes forms from the `field` component plus the relevant control. It works with both
template-driven and reactive Angular forms.

Import the pieces from `@spartan-ng/helm/field` (the `HlmFieldImports` const exports them together)
and the control from its own entrypoint (e.g. `@spartan-ng/helm/input`).

## Use `hlmField`, not raw `div`s

Wrap each control in `hlmField`. It provides the label, control slot, description, and error
display, and tracks validation state.

```html
<div hlmField>
	<label hlmFieldLabel for="email">Email</label>
	<input hlmInput id="email" [formControl]="email" />
	<p hlmFieldDescription>We'll never share your email.</p>
	@if (email.invalid && email.touched) {
	<hlm-field-error>Enter a valid email address.</hlm-field-error>
	}
</div>
```

`hlmField` supports `orientation="vertical | horizontal | responsive"`.

## Group related controls

For sets of related checkboxes or radios, use the fieldset pieces so the group has a single legend
and shared validation:

`hlmFieldSet` and `hlmFieldLegend` are directives on the native `<fieldset>` and `<legend>`
elements:

```html
<fieldset hlmFieldSet>
	<legend hlmFieldLegend>Notifications</legend>
	<div hlmFieldGroup>
		<div hlmField orientation="horizontal">
			<hlm-checkbox id="email-opt" />
			<label hlmFieldLabel for="email-opt">Email</label>
		</div>
		<div hlmField orientation="horizontal">
			<hlm-checkbox id="sms-opt" />
			<label hlmFieldLabel for="sms-opt">SMS</label>
		</div>
	</div>
</fieldset>
```

## Option sets (2-7 choices): `toggle-group`

When the user picks from a small, fixed set of mutually exclusive options, prefer `hlm-toggle-group`
over a row of buttons or a select.

```html
<hlm-toggle-group type="single" [(value)]="size">
	<button hlmToggleGroupItem value="sm">Small</button>
	<button hlmToggleGroupItem value="md">Medium</button>
	<button hlmToggleGroupItem value="lg">Large</button>
</hlm-toggle-group>
```

Use `type="multiple"` when more than one option can be active.

## Choose the right control

- Free text -> `input` / `textarea`
- One-time codes -> `input-otp`
- Input with leading/trailing affordances (icon, button, prefix) -> `input-group`
- Single choice from many -> `select`, `combobox`, or `autocomplete`
- Single choice from few -> `radio-group` or `toggle-group`
- Boolean -> `switch` or `checkbox`
- Numeric range -> `slider`
- Native dropdown -> `native-select`

## Validation display

Show errors through the `<hlm-field-error>` component (not ad-hoc text), gated on the control being
invalid and touched/dirty. The field reflects invalid state to its host so the label and control
style consistently.
