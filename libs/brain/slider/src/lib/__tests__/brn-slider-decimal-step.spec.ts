import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { BrnSlider, BrnSliderRange, BrnSliderThumb, BrnSliderTick, BrnSliderTrack } from '../../index';

@Component({
	imports: [BrnSlider, BrnSliderThumb, BrnSliderTrack, BrnSliderRange, BrnSliderTick],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnSlider
			aria-label="decimal"
			[min]="0"
			[max]="1"
			[step]="0.1"
			[showTicks]="true"
			[minStepsBetweenThumbs]="3"
			[preventStepOverThumb]="preventStepOverThumb()"
			[value]="value()"
			(valueChange)="value.set($event)"
		>
			<div brnSliderTrack>
				<div brnSliderRange></div>
			</div>
			<span *brnSliderTick="let tick; let formattedTick = formattedTick" data-testid="tick">
				{{ formattedTick }}
			</span>
			@for (i of [0, 1]; track i) {
				<span brnSliderThumb></span>
			}
		</div>
	`,
})
class DecimalStepSlider {
	public readonly preventStepOverThumb = input(false);
	public readonly initialValue = input([0.4, 1]);
	public readonly value = linkedSignal(this.initialValue);
}

async function setup(preventStepOverThumb = false, initialValue = [0.4, 1]) {
	const { fixture, container, getAllByTestId } = await render(DecimalStepSlider, {
		inputs: { preventStepOverThumb, initialValue },
	});
	await fixture.whenStable();
	const thumbs = Array.from(container.querySelectorAll<HTMLElement>('[role="slider"]'));
	return { fixture, thumbs, ticks: () => getAllByTestId('tick').map((tick) => tick.textContent?.trim()) };
}

function pressArrowLeft(thumb: HTMLElement, times: number) {
	for (let i = 0; i < times; i++) {
		fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
	}
}

describe('BrnSlider with a decimal step', () => {
	it('labels each tick with its step value', async () => {
		const { ticks } = await setup();

		expect(ticks()).toEqual(['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
	});

	it('lets a thumb come exactly minStepsBetweenThumbs steps from its neighbour', async () => {
		// 0.7 - 0.4 is 0.29999999999999993.
		const { fixture, thumbs } = await setup();

		pressArrowLeft(thumbs[1], 3);
		await fixture.whenStable();

		expect(fixture.componentInstance.value()).toEqual([0.4, 0.7]);
		expect(thumbs[1].getAttribute('aria-valuenow')).toBe('0.7');
	});

	// 0.2 + 3 * 0.1 is 0.5000000000000001, and 0.6 + 0.3 is 0.8999999999999999.
	it.each([
		{ initialValue: [0.2, 0.9], stop: 0.5 },
		{ initialValue: [0.6, 1], stop: 0.9 },
	])(
		'stops a thumb from $initialValue on $stop when preventStepOverThumb holds it back',
		async ({ initialValue, stop }) => {
			const { fixture, thumbs } = await setup(true, initialValue);

			pressArrowLeft(thumbs[1], 6);
			await fixture.whenStable();

			expect(fixture.componentInstance.value()).toEqual([initialValue[0], stop]);
			expect(thumbs[1].getAttribute('aria-valuenow')).toBe(String(stop));
		},
	);
});
