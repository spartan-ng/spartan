import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSwitch } from './brn-switch';
import { BrnSwitchThumb } from './brn-switch-thumb';

@Component({
	selector: 'brn-switch-ng-model',
	imports: [BrnSwitch, BrnSwitchThumb, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label>
			Airplane mode is: {{ airplaneMode() ? 'on' : 'off' }}
			<brn-switch [disabled]="disabled()" [(ngModel)]="airplaneMode">
				<brn-switch-thumb />
			</brn-switch>
		</label>
	`,
})
export class BrnSwitchNgModelSpec {
	public readonly disabled = input(false);

	public readonly airplaneMode = model(false);
}

describe('BrnSwitchComponentNgModelIntegration', () => {
	const setup = async (airplaneMode = false, disabled = false) => {
		const container = await render(BrnSwitchNgModelSpec, {
			inputs: {
				disabled,
				airplaneMode,
			},
		});
		const labelMatch = airplaneMode ? /airplane mode is: on/i : /airplane mode is: off/i;
		return {
			user: userEvent.setup(),
			container,
			switchElement: screen.getByLabelText(labelMatch),
			labelElement: screen.getByText(labelMatch),
		};
	};

	it('click should toggle value correctly', async () => {
		const { labelElement, user, container } = await setup();
		expect(labelElement).toBeInTheDocument();
		await user.click(labelElement);
		expect(await screen.findByRole('switch')).toHaveAttribute('value', 'on');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(true);
	});

	it('should set input as default correctly and click should toggle then', async () => {
		const { labelElement, user, container } = await setup(true);

		await user.click(labelElement);
		expect(await screen.findByRole('switch')).toHaveAttribute('value', 'off');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);

		await user.click(labelElement);
		expect(await screen.findByRole('switch')).toHaveAttribute('value', 'on');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(true);
	});

	it('should set input as default correctly and enter should toggle then', async () => {
		const { user, container } = await setup(true);

		await user.keyboard('[Tab][Enter]');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);

		await user.keyboard('[Enter]');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(true);
	});

	it('should do nothing when disabled', async () => {
		const { labelElement, user, container } = await setup(false, true);

		await user.click(labelElement);
		expect(await screen.findByRole('switch')).toHaveAttribute('value', 'off');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);

		await user.click(labelElement);
		expect(await screen.findByRole('switch')).toHaveAttribute('value', 'off');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);
	});
});
