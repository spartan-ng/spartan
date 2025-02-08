import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSelectComponent, BrnSelectImports } from '../../';

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="fruitGroup">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (fruitGroup.controls.fruit.invalid && fruitGroup.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectReactiveFieldComponent {
	public fruitGroup = new FormGroup({ fruit: new FormControl() });
}

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectSingleValueTestComponent {
	public form = new FormGroup({ fruit: new FormControl(null) });

	public brnSelectComponent = viewChild(BrnSelectComponent);
}

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectSingleValueWithInitialValueTestComponent {
	public form = new FormGroup({ fruit: new FormControl('apple') });
}

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectSingleValueWithInitialValueWithAsyncUpdateTestComponent {
	public form = new FormGroup({ fruit: new FormControl('apple') });

	constructor() {
		// queueMicrotask(() => {
		// 	this.form.patchValue({ fruit: 'apple' });
		// });
		setTimeout(() => {
			this.form.patchValue({ fruit: 'apple' });
		});
	}
}

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit" [multiple]="true">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectMultiValueTestComponent {
	public form = new FormGroup({ fruit: new FormControl<string | Array<string> | null>(null) });
}

@Component({
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit" [multiple]="true">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
					<div>Clear</div>
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>
	`,
})
export class SelectMultiValueWithInitialValueTestComponent {
	public form = new FormGroup({ fruit: new FormControl(['apple', 'blueberry']) });
}

@Component({
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, BrnSelectImports],
	selector: 'select-reactive-field-fixture',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<brn-select class="w-56" formControlName="fruit" placeholder="Select a Fruit" [multiple]="true">
				<button brnSelectTrigger data-testid="brn-select-trigger">
					<brn-select-value data-testid="brn-select-value" />
				</button>
				<brn-select-content class="w-56" data-testid="brn-select-content">
					<label brnSelectLabel>Fruits</label>
					@for (selectOption of options(); track selectOption.value) {
						<div brnOption [value]="selectOption.value">{{ selectOption.label }}</div>
					}
				</brn-select-content>
			</brn-select>
			@if (form.controls.fruit.invalid && form.controls.fruit.touched) {
				<span class="text-destructive">Required</span>
			}
		</form>

		<button (click)="updateOptions()" data-testid="update-options-btn">Update Options</button>
		<button (click)="updatePartialOptions()" data-testid="partial-options-btn">Partial Options</button>
		<button (click)="updateDiffOptions()" data-testid="diff-options-btn">Diff Options</button>
	`,
})
export class SelectMultiValueWithInitialValueWithForLoopTestComponent implements OnInit {
	public options = signal<{ value: string; label: string }[]>([]);
	public form = new FormGroup({ fruit: new FormControl(['apple', 'pineapple']) });

	ngOnInit(): void {
		this.options.set([
			{ label: 'Apple', value: 'apple' },
			{ label: 'Banana', value: 'banana' },
			{ label: 'Blueberry', value: 'blueberry' },
			{ label: 'Grapes', value: 'grapes' },
			{ label: 'Pineapple', value: 'pineapple' },
		]);
	}

	public updateOptions() {
		// Reset same options
		this.options.set([
			{ label: 'Apple', value: 'apple' },
			{ label: 'Banana', value: 'banana' },
			{ label: 'Blueberry', value: 'blueberry' },
			{ label: 'Grapes', value: 'grapes' },
			{ label: 'Pineapple', value: 'pineapple' },
		]);
	}

	public updateDiffOptions() {
		// Reset with different option values
		this.options.set([
			{ label: 'Coconut', value: 'coconut' },
			{ label: 'Grapefruit', value: 'grapefruit' },
			{ label: 'Kiwi', value: 'kiwi' },
			{ label: 'Pomegranate', value: 'pomegranate' },
			{ label: 'Watermelon', value: 'watermelon' },
		]);
	}

	public updatePartialOptions() {
		// Reset with different option values
		this.options.set([
			{ label: 'Apple', value: 'apple' },
			{ label: 'Banana', value: 'banana' },
			{ label: 'Blueberry', value: 'blueberry' },
			{ label: 'Pomegranate', value: 'pomegranate' },
			{ label: 'Watermelon', value: 'watermelon' },
		]);
	}
}
