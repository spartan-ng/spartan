import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	BrnSliderDirective,
	BrnSliderRangeDirective,
	BrnSliderThumbDirective,
	BrnSliderTrackDirective,
} from '../../index';

@Component({
	template: `
		<div>
			<pre data-testid="value-indicator-pre">Temperature: {{ temperature() }}</pre>
		</div>
		<form ngForm>
			<div brnSlider aria-label="fallback-label" [min]="0" [(ngModel)]="temperature" name="temperature">
				<div brnSliderTrack>
					<div brnSliderRange></div>
				</div>

				<span brnSliderThumb></span>
			</div>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [FormsModule, BrnSliderDirective, BrnSliderThumbDirective, BrnSliderTrackDirective, BrnSliderRangeDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDrivenFormSliderComponent {
	public readonly temperature = model<number>(0);

	changeValue(value: number) {
		this.temperature.set(value);
	}
}

@Component({
	template: `
		<div>
			<pre data-testid="value-indicator-pre">
				Temperature: {{ temperatureGroup.controls.temperature.getRawValue() }}
			</pre
			>
		</div>
		<form [formGroup]="temperatureGroup">
			<div brnSlider aria-label="fallback-label" [min]="0" formControlName="temperature">
				<div brnSliderTrack>
					<div brnSliderRange></div>
				</div>

				<span brnSliderThumb></span>
			</div>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [
		ReactiveFormsModule,
		BrnSliderDirective,
		BrnSliderThumbDirective,
		BrnSliderTrackDirective,
		BrnSliderRangeDirective,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormSliderComponent {
	public readonly temperature = model<number>(46);

	protected readonly temperatureGroup = new FormGroup({
		temperature: new FormControl<number>(this.temperature()),
	});

	changeValue(value: number) {
		this.temperatureGroup.controls.temperature.patchValue(value);
	}
}
