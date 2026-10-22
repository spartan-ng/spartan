import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnTabs, BrnTabsContent, BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@vitest/browser/context';
import { HlmTabsPaginatedList } from '../hlm-tabs-paginated-list';

@Component({
	imports: [BrnTabs, BrnTabsTrigger, BrnTabsContent, HlmTabsPaginatedList],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div [(brnTabs)]="active" activationMode="manual" (tabActivated)="activated($event)">
			<hlm-paginated-tabs-list>
				@for (key of keys; track key) {
					<button [brnTabsTrigger]="key" [attr.data-testid]="'trigger-' + key">Tab {{ key }}</button>
				}
			</hlm-paginated-tabs-list>
			@for (key of keys; track key) {
				<div [brnTabsContent]="key" [attr.data-testid]="'content-' + key">Panel {{ key }}</div>
			}
		</div>
	`,
})
class HlmPaginatedTabsSpec {
	public readonly keys = ['A', 'B', 'C'];
	public readonly active = signal<string | undefined>('A');
	public readonly activations: string[] = [];

	public activated(key: string) {
		this.activations.push(key);
	}
}

// Regression tests for https://github.com/spartan-ng/spartan/issues/1794. In manual activation mode
// Enter and Space must activate the focused tab, but `_itemSelected` calls `preventDefault()`,
// which cancels the native button activation.
describe('HlmTabsPaginatedList manual activation', () => {
	const focusSecondTab = async () => {
		const result = await render(HlmPaginatedTabsSpec);
		screen.getByTestId('trigger-A').focus();
		result.fixture.detectChanges();

		await userEvent.keyboard('{ArrowRight}');
		result.fixture.detectChanges();

		expect(document.activeElement).toBe(screen.getByTestId('trigger-B'));
		expect(result.fixture.componentInstance.active()).toBe('A');
		return result;
	};

	it('should activate the focused tab on Enter', async () => {
		const { fixture } = await focusSecondTab();

		await userEvent.keyboard('{Enter}');
		fixture.detectChanges();

		expect(fixture.componentInstance.active()).toBe('B');
	});

	it('should activate the focused tab on Space', async () => {
		const { fixture } = await focusSecondTab();

		await userEvent.keyboard('{Space}');
		fixture.detectChanges();

		expect(fixture.componentInstance.active()).toBe('B');
	});
});
