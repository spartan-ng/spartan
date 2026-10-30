import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@vitest/browser/context';
import { HlmDropdownMenu } from './hlm-dropdown-menu';
import { HlmDropdownMenuItem } from './hlm-dropdown-menu-item';
import { HlmDropdownMenuTrigger } from './hlm-dropdown-menu-trigger';

@Component({
	imports: [HlmDropdownMenuTrigger, HlmDropdownMenu, HlmDropdownMenuItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button [hlmDropdownMenuTrigger]="menu">Open</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				<button hlmDropdownMenuItem disabled (triggered)="activations.push('up')" (click)="clicks.push('up')">
					Move up
				</button>
				<button hlmDropdownMenuItem (triggered)="activations.push('down')">Move down</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
class DisabledFirstItemHost {
	public readonly activations: string[] = [];
	public readonly clicks: string[] = [];
}

// Regression for #1777: a native disabled button cannot receive the focus CDK gives menu items.
describe('HlmDropdownMenuItem disabled focus', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it.each(['click', 'Enter'] as const)('keeps keyboard navigation working after opening with %s', async (method) => {
		await render(DisabledFirstItemHost);
		const user = userEvent.setup();
		const trigger = screen.getByRole('button', { name: 'Open' });
		if (method === 'click') {
			trigger.click();
		} else {
			trigger.focus();
			await user.keyboard('[Enter]');
		}

		const first = await screen.findByRole('menuitem', { name: 'Move up' });
		await vi.waitFor(() => expect(document.activeElement).toBe(first));
		expect(first.getAttribute('aria-disabled')).toBe('true');
		expect(first.hasAttribute('disabled')).toBe(false);
		await user.keyboard('[ArrowDown]');
		expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Move down' }));
		await user.keyboard('[Home]');
		expect(document.activeElement).toBe(first);
		await user.keyboard('[End]');
		expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Move down' }));
	});

	it('does not activate a disabled item with the pointer, Enter or Space', async () => {
		const { fixture } = await render(DisabledFirstItemHost);
		const user = userEvent.setup();
		screen.getByRole('button', { name: 'Open' }).click();
		const first = await screen.findByRole('menuitem', { name: 'Move up' });
		await vi.waitFor(() => expect(document.activeElement).toBe(first));

		await user.keyboard('[Enter][Space]');
		// Dispatch directly to bypass pointer-events-none and verify that CDK blocks activation.
		document.querySelector<HTMLButtonElement>('[data-slot="dropdown-menu-item"][aria-disabled="true"]')?.click();
		expect(fixture.componentInstance.activations).toEqual([]);
		expect(screen.getByRole('menu')).toBeTruthy();

		await user.keyboard('[ArrowDown][Enter]');
		expect(fixture.componentInstance.activations).toEqual(['down']);
	});

	it('does not run consumer click handlers for a disabled item', async () => {
		const { fixture } = await render(DisabledFirstItemHost);
		const user = userEvent.setup();
		screen.getByRole('button', { name: 'Open' }).click();
		const first = await screen.findByRole('menuitem', { name: 'Move up' });
		await vi.waitFor(() => expect(document.activeElement).toBe(first));

		first.click();
		await user.keyboard('[Enter][Space]');

		expect(fixture.componentInstance.clicks).toEqual([]);
		expect(fixture.componentInstance.activations).toEqual([]);
	});
});
