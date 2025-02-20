import { Component, signal } from '@angular/core';

@Component({
	selector: 'select-ngmodel-form',
	template: `
		<form ngForm>
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit() | json }}</pre>
			</div>
			<hlm-select class="w-56" ${argsToTemplate(args, { exclude: ['initialValue'] })} [(ngModel)]="fruit" name="fruit">
				<label hlmLabel>Select a Fruit</label>
				<hlm-select-trigger>
					<brn-select-value hlm />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-select-label>Fruits</hlm-select-label>
					<hlm-option value="apple">Apple</hlm-option>
					<hlm-option value="banana">Banana</hlm-option>
					<hlm-option value="blueberry">Blueberry</hlm-option>
					<hlm-option value="grapes">Grapes</hlm-option>
					<hlm-option value="pineapple">Pineapple</hlm-option>
				</hlm-select-content>
			</hlm-select>
		</form>
	`,
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
})
export class SelectNgModelComponent {
	public fruit = signal('');
}
