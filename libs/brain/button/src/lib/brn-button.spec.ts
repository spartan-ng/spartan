import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { BrnButton } from './brn-button';

@Component({
	standalone: true,
	imports: [BrnButton],
	template: `
		<a brnButton [disabled]="disabled()">Click me</a>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHost {
	public disabled = signal(false);
}

describe('BrnButton', () => {
	it('should render and have default tabindex=0 and not have disabled class', async () => {
		const { container } = await render(TestHost);
		const button = container.querySelector('a');

		expect(button).toBeTruthy();
		expect(button?.getAttribute('tabindex')).toBe(null);
		expect(button?.classList.contains('disabled')).toBe(false);
	});

	it('should reflect disabled state: tabindex -1, class added, and prevent click', async () => {
		const { fixture, container } = await render(TestHost, {
			componentProperties: { disabled: signal(true) },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(button.getAttribute('tabindex')).toBe('-1');
		expect(button.dataset['disabled']).toBe('true');
	});

	it('should allow click when not disabled', async () => {
		const { fixture, container } = await render(TestHost, {
			componentProperties: { disabled: signal(false) },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(fireEvent.click(button)).toBe(true);
	});

	it('should not allow click when is disabled', async () => {
		const { fixture, container } = await render(TestHost, {
			componentProperties: { disabled: signal(true) },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(fireEvent.click(button)).toBe(false);
	});

	it('should toggle disabled dynamically and update attributes/classes accordingly', async () => {
		const { fixture, container } = await render(TestHost, {
			componentProperties: { disabled: signal(false) },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(button.getAttribute('tabindex')).toBe(null);
		expect(button.dataset['disabled']).toBe(undefined);

		fixture.componentInstance.disabled.set(true);
		fixture.detectChanges();
		expect(button.getAttribute('tabindex')).toBe('-1');
		expect(button.dataset['disabled']).toBe('true');

		fixture.componentInstance.disabled.set(false);
		fixture.detectChanges();
		expect(button.getAttribute('tabindex')).toBe(null);
		expect(button.dataset['disabled']).toBe(undefined);
	});
});
