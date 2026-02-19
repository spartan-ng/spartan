import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrnRangeSliderImports } from '../index';

describe('BrnRangeSlider', () => {
	const setup = async (
		opts: { value?: [number, number]; min?: number; max?: number; step?: number; disabled?: boolean } = {},
	) => {
		const { value = [20, 80], min = 0, max = 100, step = 1, disabled = false } = opts;
		const onValueChange = jest.fn();
		const container = await render(
			`
			<div brnRangeSlider
				[value]="value"
				[min]="${min}"
				[max]="${max}"
				[step]="${step}"
				${disabled ? '[disabled]="true"' : ''}
				(valueChange)="onValueChange($event)"
				aria-label="Price range"
			>
				<div brnRangeSliderTrack>
					<div brnRangeSliderRange></div>
				</div>
				<span brnRangeSliderThumb thumb="low" aria-label="Low value"></span>
				<span brnRangeSliderThumb thumb="high" aria-label="High value"></span>
			</div>
			`,
			{
				imports: [BrnRangeSliderImports],
				componentProperties: {
					value,
					onValueChange,
				},
			},
		);

		const thumbs = container.fixture.nativeElement.querySelectorAll('[role="slider"]') as NodeListOf<HTMLElement>;
		return {
			user: userEvent.setup(),
			container,
			lowThumb: thumbs[0],
			highThumb: thumbs[1],
			track: container.fixture.nativeElement.querySelector('[brnrangeslidertrack]') as HTMLElement,
			range: container.fixture.nativeElement.querySelector('[brnrangesliderrange]') as HTMLElement,
			onValueChange,
		};
	};

	describe('rendering', () => {
		it('should render with two thumbs', async () => {
			const { lowThumb, highThumb } = await setup();
			expect(lowThumb).toBeTruthy();
			expect(highThumb).toBeTruthy();
		});

		it('should set correct aria attributes on low thumb', async () => {
			const { lowThumb } = await setup({ value: [25, 75], min: 0, max: 100 });
			expect(lowThumb).toHaveAttribute('role', 'slider');
			expect(lowThumb).toHaveAttribute('aria-valuenow', '25');
			expect(lowThumb).toHaveAttribute('aria-valuemin', '0');
			expect(lowThumb).toHaveAttribute('aria-valuemax', '75');
		});

		it('should set correct aria attributes on high thumb', async () => {
			const { highThumb } = await setup({ value: [25, 75], min: 0, max: 100 });
			expect(highThumb).toHaveAttribute('role', 'slider');
			expect(highThumb).toHaveAttribute('aria-valuenow', '75');
			expect(highThumb).toHaveAttribute('aria-valuemin', '25');
			expect(highThumb).toHaveAttribute('aria-valuemax', '100');
		});

		it('should have no accessibility violations', async () => {
			const { container } = await setup();
			expect(await axe(container.fixture.nativeElement)).toHaveNoViolations();
		});
	});

	describe('keyboard navigation', () => {
		it('should increment low thumb with ArrowRight', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 1 });

			lowThumb.focus();
			await user.keyboard('[ArrowRight]');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '21');
			expect(onValueChange).toHaveBeenCalledWith([21, 80]);
		});

		it('should decrement low thumb with ArrowLeft', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 1 });

			lowThumb.focus();
			await user.keyboard('[ArrowLeft]');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '19');
			expect(onValueChange).toHaveBeenCalledWith([19, 80]);
		});

		it('should increment high thumb with ArrowRight', async () => {
			const { highThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 1 });

			highThumb.focus();
			await user.keyboard('[ArrowRight]');
			container.detectChanges();

			expect(highThumb).toHaveAttribute('aria-valuenow', '81');
			expect(onValueChange).toHaveBeenCalledWith([20, 81]);
		});

		it('should decrement high thumb with ArrowLeft', async () => {
			const { highThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 1 });

			highThumb.focus();
			await user.keyboard('[ArrowLeft]');
			container.detectChanges();

			expect(highThumb).toHaveAttribute('aria-valuenow', '79');
			expect(onValueChange).toHaveBeenCalledWith([20, 79]);
		});

		it('should move low thumb to min on Home', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], min: 0 });

			lowThumb.focus();
			await user.keyboard('[Home]');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '0');
			expect(onValueChange).toHaveBeenCalledWith([0, 80]);
		});

		it('should move high thumb to max on End', async () => {
			const { highThumb, container, user, onValueChange } = await setup({ value: [20, 80], max: 100 });

			highThumb.focus();
			await user.keyboard('[End]');
			container.detectChanges();

			expect(highThumb).toHaveAttribute('aria-valuenow', '100');
			expect(onValueChange).toHaveBeenCalledWith([20, 100]);
		});

		it('should step by 10 when Shift+ArrowRight', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 1 });

			lowThumb.focus();
			await user.keyboard('{Shift>}[ArrowRight]{/Shift}');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '30');
			expect(onValueChange).toHaveBeenCalledWith([30, 80]);
		});
	});

	describe('disabled state', () => {
		it('should add data-disabled attribute when disabled', async () => {
			const { lowThumb, highThumb, track } = await setup({ disabled: true });
			expect(lowThumb).toHaveAttribute('data-disabled', 'true');
			expect(highThumb).toHaveAttribute('data-disabled', 'true');
			expect(track).toHaveAttribute('data-disabled', 'true');
		});

		it('should set tabindex to -1 when disabled', async () => {
			const { lowThumb, highThumb } = await setup({ disabled: true });
			expect(lowThumb).toHaveAttribute('tabindex', '-1');
			expect(highThumb).toHaveAttribute('tabindex', '-1');
		});

		it('should not respond to keyboard when disabled', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], disabled: true });

			lowThumb.focus();
			await user.keyboard('[ArrowRight]');
			container.detectChanges();

			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	describe('clamping', () => {
		it('should clamp low thumb to not go below min', async () => {
			const { lowThumb, container, user } = await setup({ value: [0, 80], min: 0 });

			lowThumb.focus();
			await user.keyboard('[ArrowLeft]');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '0');
		});

		it('should clamp high thumb to not go above max', async () => {
			const { highThumb, container, user } = await setup({ value: [20, 100], max: 100 });

			highThumb.focus();
			await user.keyboard('[ArrowRight]');
			container.detectChanges();

			expect(highThumb).toHaveAttribute('aria-valuenow', '100');
		});

		it('should allow thumbs to cross over (sort values)', async () => {
			// low=45, high=50 — pressing ArrowRight on low 6 times should cross
			const { lowThumb, container, user, onValueChange } = await setup({ value: [45, 50], step: 1 });

			lowThumb.focus();
			for (let i = 0; i < 6; i++) {
				await user.keyboard('[ArrowRight]');
			}
			container.detectChanges();

			// After crossover, values should still be sorted [low, high]
			const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
			expect(lastCall[0]).toBeLessThanOrEqual(lastCall[1]);
		});
	});

	describe('step snapping', () => {
		it('should respect step value', async () => {
			const { lowThumb, container, user, onValueChange } = await setup({ value: [20, 80], step: 5 });

			lowThumb.focus();
			await user.keyboard('[ArrowRight]');
			container.detectChanges();

			expect(lowThumb).toHaveAttribute('aria-valuenow', '25');
			expect(onValueChange).toHaveBeenCalledWith([25, 80]);
		});
	});
});
