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
			[min]="min()"
			[max]="max()"
			[step]="step()"
			[showTicks]="true"
			[minStepsBetweenThumbs]="minStepsBetweenThumbs()"
			[maxStepsBetweenThumbs]="maxStepsBetweenThumbs()"
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
	public readonly min = input(0);
	public readonly max = input(1);
	public readonly step = input(0.1);
	public readonly minStepsBetweenThumbs = input(3);
	public readonly maxStepsBetweenThumbs = input(Number.POSITIVE_INFINITY);
	public readonly preventStepOverThumb = input(false);
	public readonly initialValue = input([0.4, 1]);
	public readonly value = linkedSignal(this.initialValue);
}

type SliderInputs = Partial<{
	min: number;
	max: number;
	step: number;
	minStepsBetweenThumbs: number;
	maxStepsBetweenThumbs: number;
	preventStepOverThumb: boolean;
	initialValue: number[];
}>;

async function setup(inputs: SliderInputs = {}) {
	const { fixture, container, getAllByTestId } = await render(DecimalStepSlider, { inputs });
	await fixture.whenStable();
	const thumbs = Array.from(container.querySelectorAll<HTMLElement>('[role="slider"]'));
	return { fixture, thumbs, ticks: () => getAllByTestId('tick').map((tick) => tick.textContent?.trim()) };
}

async function press(fixture: { whenStable(): Promise<unknown> }, thumb: HTMLElement, key: string, times: number) {
	for (let i = 0; i < times; i++) {
		fireEvent.keyDown(thumb, { key });
	}
	await fixture.whenStable();
}

describe('BrnSlider with a decimal step', () => {
	it('labels each tick with its step value', async () => {
		const { ticks } = await setup();

		expect(ticks()).toEqual(['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
	});

	it('keeps the ticks of a step written in exponent notation apart', async () => {
		// String(0.0000001) is '1e-7'.
		const { ticks } = await setup({ max: 0.000001, step: 0.0000001 });

		expect(new Set(ticks()).size).toBe(11);
	});

	it('lets a thumb come exactly minStepsBetweenThumbs steps from its neighbour', async () => {
		// 0.7 - 0.4 is 0.29999999999999993.
		const { fixture, thumbs } = await setup();

		await press(fixture, thumbs[1], 'ArrowLeft', 3);

		expect(fixture.componentInstance.value()).toEqual([0.4, 0.7]);
		expect(thumbs[1].getAttribute('aria-valuenow')).toBe('0.7');
	});

	// 0.3 + 3 * 0.1 is 0.6000000000000001, and 0.4 + 3 * 0.1 is 0.7000000000000001.
	it.each([
		{ initialValue: [0.3, 0.9], stop: 0.6 },
		{ initialValue: [0.4, 1], stop: 0.7 },
	])(
		'stops a thumb from $initialValue on $stop when preventStepOverThumb holds it back',
		async ({ initialValue, stop }) => {
			const { fixture, thumbs } = await setup({ preventStepOverThumb: true, initialValue });

			await press(fixture, thumbs[1], 'ArrowLeft', 6);

			expect(fixture.componentInstance.value()).toEqual([initialValue[0], stop]);
			expect(thumbs[1].getAttribute('aria-valuenow')).toBe(String(stop));
		},
	);

	it('keeps a gap off the step grid that is below minStepsBetweenThumbs from passing', async () => {
		// A value set from outside need not lie on the grid: 1 - 0.4 is 0.6, under one step of 1.
		const { fixture, thumbs } = await setup({
			max: 10,
			step: 1,
			minStepsBetweenThumbs: 1,
			initialValue: [0.4, 2],
		});

		await press(fixture, thumbs[1], 'ArrowLeft', 1);

		expect(fixture.componentInstance.value()).toEqual([0.4, 2]);
	});

	it('stops a thumb off the step grid exactly minStepsBetweenThumbs from its neighbour', async () => {
		const { fixture, thumbs } = await setup({
			max: 10,
			step: 1,
			minStepsBetweenThumbs: 1,
			preventStepOverThumb: true,
			initialValue: [0.4, 2],
		});

		await press(fixture, thumbs[1], 'ArrowLeft', 1);

		expect(fixture.componentInstance.value()).toEqual([0.4, 1.4]);
	});

	it('stops a thumb a fraction of a step from its neighbour when preventStepOverThumb holds it back', async () => {
		// 0.4 + 0.25 * 0.1 is 0.42500000000000004.
		const { fixture, thumbs } = await setup({
			minStepsBetweenThumbs: 0.25,
			preventStepOverThumb: true,
			initialValue: [0.4, 0.7],
		});

		await press(fixture, thumbs[1], 'ArrowLeft', 5);

		expect(fixture.componentInstance.value()).toEqual([0.4, 0.425]);
	});

	it('keeps a fraction of a step between the thumbs', async () => {
		// 0.25 steps of 0.1 is 0.025, which must not round down to no gap at all.
		const { fixture, thumbs } = await setup({ minStepsBetweenThumbs: 0.25, initialValue: [0, 0.3] });

		await press(fixture, thumbs[1], 'ArrowLeft', 5);

		expect(fixture.componentInstance.value()).toEqual([0, 0.1]);
	});

	it('keeps the thumbs within maxStepsBetweenThumbs when it is a fraction of steps', async () => {
		// 1.5 steps of 0.1 is 0.15, which must not round up to 0.2.
		const { fixture, thumbs } = await setup({
			minStepsBetweenThumbs: 0,
			maxStepsBetweenThumbs: 1.5,
			initialValue: [0, 0.1],
		});

		await press(fixture, thumbs[1], 'ArrowRight', 1);

		expect(fixture.componentInstance.value()).toEqual([0, 0.1]);
	});
});
