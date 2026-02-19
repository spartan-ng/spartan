import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrnTimeInputImports } from '../index';
import type { BrnTimeValue } from './brn-time-input';

describe('BrnTimeInput', () => {
	const defaultValue: BrnTimeValue = { hours: 10, minutes: 30, seconds: 0, period: 'AM' };

	const setup = async (opts: { value?: BrnTimeValue; disabled?: boolean } = {}) => {
		const { value = defaultValue, disabled = false } = opts;
		const onValueChange = jest.fn();
		const container = await render(
			`
			<brn-time-input
				[value]="value"
				${disabled ? '[disabled]="true"' : ''}
				(valueChange)="onValueChange($event)"
			>
				<brn-time-input-segment segment="hours" />
				<span aria-hidden="true">:</span>
				<brn-time-input-segment segment="minutes" />
				<span aria-hidden="true">:</span>
				<brn-time-input-segment segment="seconds" />
				<brn-time-input-segment segment="period" />
			</brn-time-input>
			`,
			{
				imports: [BrnTimeInputImports],
				componentProperties: {
					value,
					onValueChange,
				},
			},
		);

		const spinbuttons = screen.getAllByRole('spinbutton');
		return {
			user: userEvent.setup(),
			container,
			hours: spinbuttons[0],
			minutes: spinbuttons[1],
			seconds: spinbuttons[2],
			period: spinbuttons[3],
			onValueChange,
		};
	};

	describe('rendering', () => {
		it('should render four spinbutton segments', async () => {
			await setup();
			expect(screen.getAllByRole('spinbutton')).toHaveLength(4);
		});

		it('should display formatted time values', async () => {
			const { hours, minutes, seconds, period } = await setup();
			expect(hours).toHaveTextContent('10');
			expect(minutes).toHaveTextContent('30');
			expect(seconds).toHaveTextContent('00');
			expect(period).toHaveTextContent('AM');
		});

		it('should pad single-digit values with zero', async () => {
			const { hours, minutes } = await setup({ value: { hours: 3, minutes: 5, seconds: 7, period: 'PM' } });
			expect(hours).toHaveTextContent('03');
			expect(minutes).toHaveTextContent('05');
		});

		it('should set correct aria attributes on hours segment', async () => {
			const { hours } = await setup();
			expect(hours).toHaveAttribute('role', 'spinbutton');
			expect(hours).toHaveAttribute('aria-valuenow', '10');
			expect(hours).toHaveAttribute('aria-valuemin', '1');
			expect(hours).toHaveAttribute('aria-valuemax', '12');
			expect(hours).toHaveAttribute('aria-label', 'hours');
		});

		it('should set correct aria attributes on minutes segment', async () => {
			const { minutes } = await setup();
			expect(minutes).toHaveAttribute('aria-valuenow', '30');
			expect(minutes).toHaveAttribute('aria-valuemin', '0');
			expect(minutes).toHaveAttribute('aria-valuemax', '59');
		});

		it('should have no accessibility violations', async () => {
			const { container } = await setup();
			expect(await axe(container.fixture.nativeElement)).toHaveNoViolations();
		});
	});

	describe('keyboard navigation — ArrowUp / ArrowDown', () => {
		it('should increment hours with ArrowUp', async () => {
			const { hours, container, user, onValueChange } = await setup();
			hours.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '11');
			expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ hours: 11 }));
		});

		it('should decrement hours with ArrowDown', async () => {
			const { hours, container, user, onValueChange } = await setup();
			hours.focus();
			await user.keyboard('[ArrowDown]');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '9');
			expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ hours: 9 }));
		});

		it('should wrap hours from 12 to 1 on increment', async () => {
			const { hours, container, user } = await setup({ value: { hours: 12, minutes: 0, seconds: 0, period: 'AM' } });
			hours.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '1');
		});

		it('should wrap hours from 1 to 12 on decrement', async () => {
			const { hours, container, user } = await setup({ value: { hours: 1, minutes: 0, seconds: 0, period: 'AM' } });
			hours.focus();
			await user.keyboard('[ArrowDown]');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '12');
		});

		it('should increment minutes with ArrowUp', async () => {
			const { minutes, container, user } = await setup();
			minutes.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(minutes).toHaveAttribute('aria-valuenow', '31');
		});

		it('should wrap minutes from 59 to 0', async () => {
			const { minutes, container, user } = await setup({ value: { hours: 10, minutes: 59, seconds: 0, period: 'AM' } });
			minutes.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(minutes).toHaveAttribute('aria-valuenow', '0');
		});

		it('should increment seconds with ArrowUp', async () => {
			const { seconds, container, user } = await setup({
				value: { hours: 10, minutes: 30, seconds: 45, period: 'AM' },
			});
			seconds.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(seconds).toHaveAttribute('aria-valuenow', '46');
		});

		it('should wrap seconds from 59 to 0', async () => {
			const { seconds, container, user } = await setup({
				value: { hours: 10, minutes: 30, seconds: 59, period: 'AM' },
			});
			seconds.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(seconds).toHaveAttribute('aria-valuenow', '0');
		});
	});

	describe('period toggle', () => {
		it('should toggle period with ArrowUp', async () => {
			const { period, container, user } = await setup();
			period.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(period).toHaveTextContent('PM');
		});

		it('should toggle period with ArrowDown', async () => {
			const { period, container, user } = await setup({ value: { hours: 10, minutes: 0, seconds: 0, period: 'PM' } });
			period.focus();
			await user.keyboard('[ArrowDown]');
			container.detectChanges();

			expect(period).toHaveTextContent('AM');
		});

		it('should set AM when pressing "a"', async () => {
			const { period, container, user } = await setup({ value: { hours: 10, minutes: 0, seconds: 0, period: 'PM' } });
			period.focus();
			await user.keyboard('a');
			container.detectChanges();

			expect(period).toHaveTextContent('AM');
		});

		it('should set PM when pressing "p"', async () => {
			const { period, container, user } = await setup();
			period.focus();
			await user.keyboard('p');
			container.detectChanges();

			expect(period).toHaveTextContent('PM');
		});
	});

	describe('digit entry', () => {
		it('should set hours via digit keys', async () => {
			const { hours, container, user } = await setup({ value: { hours: 12, minutes: 0, seconds: 0, period: 'AM' } });
			hours.focus();
			await user.keyboard('9');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '9');
		});

		it('should build two-digit hours', async () => {
			const { hours, container, user } = await setup({ value: { hours: 1, minutes: 0, seconds: 0, period: 'AM' } });
			hours.focus();
			await user.keyboard('1');
			container.detectChanges();
			await user.keyboard('2');
			container.detectChanges();

			expect(hours).toHaveAttribute('aria-valuenow', '12');
		});

		it('should set minutes via digit keys', async () => {
			const { minutes, container, user } = await setup();
			minutes.focus();
			await user.keyboard('4');
			container.detectChanges();
			await user.keyboard('5');
			container.detectChanges();

			expect(minutes).toHaveAttribute('aria-valuenow', '45');
		});
	});

	describe('disabled state', () => {
		it('should set tabindex to -1 when disabled', async () => {
			const { hours, minutes, seconds, period } = await setup({ disabled: true });
			expect(hours).toHaveAttribute('tabindex', '-1');
			expect(minutes).toHaveAttribute('tabindex', '-1');
			expect(seconds).toHaveAttribute('tabindex', '-1');
			expect(period).toHaveAttribute('tabindex', '-1');
		});

		it('should not respond to keyboard when disabled', async () => {
			const { hours, container, user, onValueChange } = await setup({ disabled: true });
			hours.focus();
			await user.keyboard('[ArrowUp]');
			container.detectChanges();

			expect(onValueChange).not.toHaveBeenCalled();
		});

		it('should set data-disabled on segments', async () => {
			const { container } = await setup({ disabled: true });
			const segments = container.fixture.nativeElement.querySelectorAll('brn-time-input-segment');
			for (const seg of Array.from(segments)) {
				expect(seg).toHaveAttribute('data-disabled', 'true');
			}
		});
	});

	describe('focus management', () => {
		it('should set active segment on focus', async () => {
			const { hours, container } = await setup();
			hours.focus();
			container.detectChanges();
			const hoursHost = hours.closest('brn-time-input-segment');
			expect(hoursHost).toHaveAttribute('data-active', 'true');
		});

		it('should clear active segment on blur', async () => {
			const { hours, container } = await setup();
			hours.focus();
			hours.blur();
			container.detectChanges();

			const hoursHost = hours.closest('brn-time-input-segment');
			expect(hoursHost).not.toHaveAttribute('data-active');
		});
	});

	describe('keyboard navigation — ArrowRight / ArrowLeft', () => {
		it('should move focus from hours to minutes with ArrowRight', async () => {
			const { hours, minutes, user } = await setup();
			hours.focus();
			await user.keyboard('[ArrowRight]');

			expect(document.activeElement).toBe(minutes);
		});

		it('should move focus from minutes to seconds with ArrowRight', async () => {
			const { minutes, seconds, user } = await setup();
			minutes.focus();
			await user.keyboard('[ArrowRight]');

			expect(document.activeElement).toBe(seconds);
		});

		it('should move focus from seconds to period with ArrowRight', async () => {
			const { seconds, period, user } = await setup();
			seconds.focus();
			await user.keyboard('[ArrowRight]');

			expect(document.activeElement).toBe(period);
		});

		it('should move focus from period to minutes with ArrowLeft', async () => {
			const { period, seconds, user } = await setup();
			period.focus();
			await user.keyboard('[ArrowLeft]');

			expect(document.activeElement).toBe(seconds);
		});

		it('should move focus from minutes to hours with ArrowLeft', async () => {
			const { minutes, hours, user } = await setup();
			minutes.focus();
			await user.keyboard('[ArrowLeft]');

			expect(document.activeElement).toBe(hours);
		});

		it('should not move focus left from hours (first segment)', async () => {
			const { hours, user } = await setup();
			hours.focus();
			await user.keyboard('[ArrowLeft]');

			expect(document.activeElement).toBe(hours);
		});

		it('should not move focus right from period (last segment) when no sibling element', async () => {
			const { period, user } = await setup();
			period.focus();
			await user.keyboard('[ArrowRight]');

			expect(document.activeElement).toBe(period);
		});
	});

	describe('keyboard navigation — ArrowRight / ArrowLeft with sibling elements', () => {
		const setupWithSibling = async () => {
			const onValueChange = jest.fn();
			const container = await render(
				`
				<div>
					<brn-time-input
						[value]="value"
						(valueChange)="onValueChange($event)"
					>
						<brn-time-input-segment segment="hours" />
						<span aria-hidden="true">:</span>
						<brn-time-input-segment segment="minutes" />
						<brn-time-input-segment segment="period" />
					</brn-time-input>
					<button id="sibling-btn">Trigger</button>
				</div>
				`,
				{
					imports: [BrnTimeInputImports],
					componentProperties: {
						value: defaultValue,
						onValueChange,
					},
				},
			);

			const spinbuttons = screen.getAllByRole('spinbutton');
			const siblingBtn = container.fixture.nativeElement.querySelector('#sibling-btn') as HTMLButtonElement;
			return {
				user: userEvent.setup(),
				container,
				hours: spinbuttons[0],
				minutes: spinbuttons[1],
				period: spinbuttons[2],
				siblingBtn,
			};
		};

		it('should move focus from last segment to sibling button with ArrowRight', async () => {
			const { period, siblingBtn, user } = await setupWithSibling();
			period.focus();
			await user.keyboard('[ArrowRight]');

			expect(document.activeElement).toBe(siblingBtn);
		});

		it('should not move focus from first segment to any element before it with ArrowLeft', async () => {
			const { hours, user } = await setupWithSibling();
			hours.focus();
			await user.keyboard('[ArrowLeft]');

			expect(document.activeElement).toBe(hours);
		});
	});
});
