import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSelectImports } from '../../index';

@Component({
	selector: 'select-ngmodel-form',
	template: `
		<form ngForm>
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit() | json }}</pre>
			</div>
			<brn-select class="w-56" [(ngModel)]="fruit" name="fruit">
				<label hlmLabel>Select a Fruit</label>
				<button brnSelectTrigger class="w-56" data-testid="brn-select-trigger">
					<brn-select-value />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
				</brn-select-content>
			</brn-select>
		</form>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BrnSelectImports, ReactiveFormsModule, JsonPipe, FormsModule],
})
export class SelectNgModel {
	public readonly fruit = signal('');
}
