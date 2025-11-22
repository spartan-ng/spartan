import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSelectImports } from '../../index';

@Component({
	selector: 'select-ngmodel-form',
	imports: [ReactiveFormsModule, FormsModule, JsonPipe, BrnSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form ngForm>
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit() | json }}</pre>
			</div>
			<brn-select class="w-56" [(ngModel)]="fruit" name="fruit">
				<label>Select a Fruit</label>
				<div brnSelectTrigger>
					<brn-select-value />
				</div>
				<brn-select-content>
					<div brnSelectLabel>Fruits</div>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
				</brn-select-content>
			</brn-select>
		</form>
	`,
})
export class SelectNgModel {
	public readonly fruit = signal('');
}
