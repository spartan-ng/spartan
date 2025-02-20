import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	BrnSliderDirective,
	BrnSliderInputDirective,
	BrnSliderThumbDirective,
	BrnSliderTrackDirective,
} from '../../index';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<pre data-testid="value-indicator-pre">Temperature: {{ temperature() }}</pre>
		</div>
		<form ngForm>
			<div brnSlider [ariaLabel]="'fallback-label'" [min]="0">
				<div brnSliderTrack>
					<input brnSliderInput data-testid="input" [(ngModel)]="temperature" name="temperature" />
				</div>
				<div brnSliderThumb></div>
			</div>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [FormsModule, BrnSliderDirective, BrnSliderThumbDirective, BrnSliderInputDirective, BrnSliderTrackDirective],
})
export class TemplateDrivenFormSliderComponent {
	public readonly temperature = model<number | string>('0');

	changeValue(value: number) {
		this.temperature.set(value);
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<pre data-testid="value-indicator-pre">
				Temperature: {{ temperatureGroup.controls.temperature.getRawValue() }}
			</pre
			>
		</div>
		<form [formGroup]="temperatureGroup">
			<div brnSlider [ariaLabel]="'fallback-label'" [min]="0">
				<div brnSliderTrack>
					<input brnSliderInput data-testid="input" formControlName="temperature" />
				</div>
				<div brnSliderThumb></div>
			</div>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [
		ReactiveFormsModule,
		BrnSliderDirective,
		BrnSliderThumbDirective,
		BrnSliderTrackDirective,
		BrnSliderInputDirective,
		AsyncPipe,
		JsonPipe,
	],
})
export class ReactiveFormSliderComponent {
	public readonly temperature = model<number | string>('46');

	protected readonly temperatureGroup = new FormGroup({
		temperature: new FormControl<string | number>(this.temperature()),
	});

	changeValue(value: number | string) {
		this.temperatureGroup.controls.temperature.patchValue(value);
	}
}
