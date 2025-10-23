import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmCheckbox } from './hlm-checkbox';

@Component({
	selector: 'hlm-checkbox-form',
	imports: [HlmCheckbox, FormsModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<label for="checkbox">
				Airplane mode is: {{ form.value.checkbox ? 'on' : 'off' }}
				<hlm-checkbox
					id="checkbox"
					(checkedChange)="onCheckedChange($event)"
					formControlName="checkbox"
					aria-labelledby="testCheckbox"
				></hlm-checkbox>
			</label>
		</form>
		{{ form.value }}
	`,
})
export class HlmCheckboxFormSpec {
	public checkedChangedCalled = false;
	public checkedEmittedValue = false;
	public form = inject(FormBuilder).group({
		checkbox: [false],
	});

	onCheckedChange(checked: boolean) {
		this.checkedChangedCalled = true;
		this.checkedEmittedValue = checked;
	}
}

describe('HlmCheckboxComponentReactiveForms', () => {
	const setup = async (airplaneMode = false) => {
		const container = await render(HlmCheckboxFormSpec);
		const labelMatch = airplaneMode ? /airplane mode is: on/i : /airplane mode is: off/i;
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(labelMatch),
		};
	};

	it('should not emit change when the value is set programmatically', async () => {
		const { container } = await setup();
		container.fixture.componentInstance.form.setValue({ checkbox: true });
		expect(container.fixture.componentInstance.checkedChangedCalled).toBe(false);
	});

	it('should emit true when an unchecked checkbox is clicked', async () => {
		const { container, checkboxElement } = await setup();
		// Initial state is unchecked
		checkboxElement.click();
		expect(container.fixture.componentInstance.checkedChangedCalled).toBe(true);
		expect(container.fixture.componentInstance.checkedEmittedValue).toBe(true);
	});

	it('should emit false when a checked checkbox is clicked', async () => {
		const { container, checkboxElement } = await setup();
		// Programmatically check the box first
		container.fixture.componentInstance.form.setValue({ checkbox: true });
		container.fixture.detectChanges();
		// Now click the checked box
		checkboxElement.click();
		expect(container.fixture.componentInstance.checkedChangedCalled).toBe(true);
		expect(container.fixture.componentInstance.checkedEmittedValue).toBe(false);
	});
});
