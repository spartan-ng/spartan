import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawer } from './brn-drawer';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
	selector: 'brn-drawer-nested-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer data-testid="parent">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup>
					<div brnDrawer data-testid="first">
						<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>First</div></div>
					</div>
					@if (showSecond()) {
						<div brnDrawer data-testid="second">
							<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Second</div></div>
						</div>
					}
				</div>
			</div>
		</div>
	`,
})
class NestedHost {
	public readonly showSecond = signal(false);
}

describe('BrnDrawer nesting', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the parent count when a nested drawer that never opened is created or destroyed', async () => {
		const view = await render(NestedHost);
		const parent = view.fixture.debugElement.query(By.css('[data-testid="parent"]')).injector.get(BrnDrawer);
		parent.open();
		view.detectChanges();
		await wait(20);

		const first = view.fixture.debugElement.query(By.css('[data-testid="first"]')).injector.get(BrnDrawer);
		first.open();
		view.detectChanges();
		await wait(20);
		expect(parent.nestedOpenDrawerCount()).toBe(1);

		view.fixture.componentInstance.showSecond.set(true);
		view.detectChanges();
		await wait(20);
		expect(parent.nestedOpenDrawerCount()).toBe(1);

		view.fixture.componentInstance.showSecond.set(false);
		view.detectChanges();
		await wait(20);
		expect(parent.nestedOpenDrawerCount()).toBe(1);
	});
});
