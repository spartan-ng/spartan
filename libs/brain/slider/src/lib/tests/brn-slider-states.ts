import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSlider, BrnSliderRange, BrnSliderThumb, BrnSliderTrack } from '../../index';

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
	imports: [FormsModule, BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDrivenFormSlider {
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
	imports: [ReactiveFormsModule, BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormSlider {
	public readonly temperature = model<number>(46);

	protected readonly temperatureGroup = new FormGroup({
		temperature: new FormControl<number>(this.temperature()),
	});

	changeValue(value: number) {
		this.temperatureGroup.controls.temperature.patchValue(value);
	}
}
