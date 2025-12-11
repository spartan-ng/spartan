import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnCheckbox } from './brn-checkbox';

@Component({
	selector: 'brn-checkbox-ng-model',
	imports: [BrnCheckbox, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label>
			Airplane mode is: {{ airplaneMode() ? 'on' : 'off' }}
			<brn-checkbox [disabled]="disabled()" [(ngModel)]="airplaneMode"></brn-checkbox>
		</label>
	`,
})
export class BrnCheckboxNgModelSpec {
	public readonly disabled = input(false);

	public readonly airplaneMode = model(false);
}

describe('BrnCheckboxComponentNgModelIntegration', () => {
	const setup = async (airplaneMode = false, disabled = false) => {
		const container = await render(BrnCheckboxNgModelSpec, {
			componentInputs: {
				disabled,
				airplaneMode,
			},
		});
		const labelMatch = airplaneMode ? /airplane mode is: on/i : /airplane mode is: off/i;
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(labelMatch),
			labelElement: screen.getByText(labelMatch),
		};
	};

	it('click should toggle value correctly', async () => {
		const { labelElement, user, container } = await setup();
		expect(labelElement).toBeInTheDocument();
		await user.click(labelElement);
		expect(await screen.findByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(true);
	});

	it('should set input as default correctly and click should toggle then', async () => {
		const { labelElement, user, container } = await setup(true);

		await user.click(labelElement);
		expect(await screen.findByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);

		await user.click(labelElement);
		expect(await screen.findByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
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
		expect(await screen.findByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);

		await user.click(labelElement);
		expect(await screen.findByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
		expect(container.fixture.componentInstance.airplaneMode()).toBe(false);
	});
});
