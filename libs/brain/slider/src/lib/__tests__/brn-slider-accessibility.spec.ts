import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render } from '@testing-library/angular';
import { BrnSlider, BrnSliderRange, BrnSliderThumb, BrnSliderTrack } from '../../index';

@Component({
	imports: [BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label id="volume-label">Volume</label>
		<div brnSlider aria-labelledby="volume-label" [value]="[50]">
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span brnSliderThumb></span>
		</div>
	`,
})
class SliderWithAriaLabelledby {}

@Component({
	imports: [BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnSlider aria-label="Volume" [value]="[50]">
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span brnSliderThumb></span>
		</div>
	`,
})
class SliderWithAriaLabel {}

@Component({
	imports: [BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnSlider [value]="[25, 75]">
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span brnSliderThumb></span>
			<span brnSliderThumb></span>
		</div>
	`,
})
class SliderWithDefaultAriaLabels {}

@Component({
	imports: [BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnSlider [value]="[30]">
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span brnSliderThumb></span>
		</div>
		<div brnSlider [value]="[70]">
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span brnSliderThumb></span>
		</div>
	`,
})
class TwoSliders {}

describe('Slider Accessibility', () => {
	it('should forward aria-labelledby from slider to thumb', async () => {
		const { container } = await render(SliderWithAriaLabelledby);
		const thumb = container.querySelector('[role="slider"]') as HTMLElement;

		expect(thumb.getAttribute('aria-labelledby')).toBe('volume-label');
	});

	it('should forward aria-label from slider to thumb', async () => {
		const { container } = await render(SliderWithAriaLabel);
		const thumb = container.querySelector('[role="slider"]') as HTMLElement;

		expect(thumb.getAttribute('aria-label')).toBe('Volume');
	});

	it('should generate default positional aria-labels for multiple thumbs', async () => {
		const { container } = await render(SliderWithDefaultAriaLabels);
		const thumbs = container.querySelectorAll('[role="slider"]');

		expect(thumbs[0].getAttribute('aria-label')).toBe('Value 1 of 2');
		expect(thumbs[1].getAttribute('aria-label')).toBe('Value 2 of 2');
	});

	it('should not set aria-labelledby when not provided', async () => {
		const { container } = await render(SliderWithDefaultAriaLabels);
		const thumb = container.querySelector('[role="slider"]') as HTMLElement;

		expect(thumb.getAttribute('aria-labelledby')).toBeNull();
	});

	it('should generate unique IDs for multiple slider instances', async () => {
		const { container } = await render(TwoSliders);
		const sliders = container.querySelectorAll('[data-slot="slider"]');
		const id1 = sliders[0].getAttribute('id');
		const id2 = sliders[1].getAttribute('id');

		expect(id1).toBeTruthy();
		expect(id2).toBeTruthy();
		expect(id1).not.toBe(id2);
	});
});
