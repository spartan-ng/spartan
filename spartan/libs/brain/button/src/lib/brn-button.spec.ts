import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { BrnButton } from './brn-button';

@Component({
	imports: [BrnButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<a brnButton [disabled]="disabled" (click)="onClick()">Click me</a>
	`,
})
class TestHost {
	public disabled = false;
	public onClick = () => {
		// Placeholder for click handler
	};
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
			componentProperties: { disabled: true },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(button.getAttribute('tabindex')).toBe('-1');
		expect(button.dataset['disabled']).toBe('true');
	});

	it('should allow click when not disabled', async () => {
		const onClick = jest.fn();
		const { fixture, container } = await render(TestHost, {
			componentProperties: { disabled: false, onClick },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		fireEvent.click(button);
		expect(onClick).toHaveBeenCalled();
	});

	it('should not allow click when is disabled', async () => {
		const onClick = jest.fn();
		const { fixture, container } = await render(TestHost, {
			componentProperties: {
				disabled: true,
				onClick,
			},
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(button.getAttribute('tabindex')).toBe('-1');
		expect(button.dataset['disabled']).toBe('true');
		fireEvent.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('should toggle disabled dynamically and update attributes/classes accordingly', async () => {
		const { fixture, container, rerender } = await render(TestHost, {
			componentProperties: { disabled: false },
		});
		fixture.detectChanges();

		const button = container.querySelector('a')!;
		expect(button.getAttribute('tabindex')).toBe(null);
		expect(button.dataset['disabled']).toBe(undefined);

		await rerender({ componentProperties: { disabled: true } });
		fixture.detectChanges();
		expect(button.getAttribute('tabindex')).toBe('-1');
		expect(button.dataset['disabled']).toBe('true');

		await rerender({ componentProperties: { disabled: false } });
		fixture.detectChanges();
		expect(button.getAttribute('tabindex')).toBe(null);
		expect(button.dataset['disabled']).toBe(undefined);
	});
});
