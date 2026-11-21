import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawer } from './brn-drawer';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
	selector: 'brn-drawer-trigger-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button data-testid="first" [brnDrawerTriggerFor]="drawer" payload="first">First</button>
		<button data-testid="second" [brnDrawerTriggerFor]="drawer" payload="second">Second</button>
		<div brnDrawer #drawer="brnDrawer" [autoFocus]="autoFocus()">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="popup">
					<input data-testid="input" />
				</div>
			</div>
		</div>
	`,
})
class TriggerHost {
	public readonly autoFocus = input<string>('[data-drawer-popup]');
}

const byTestId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe('BrnDrawer triggers and focus', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	async function setup(inputs: { autoFocus?: string } = {}) {
		const view = await render(TriggerHost, { inputs });
		const drawer = view.fixture.debugElement.query(By.directive(BrnDrawer)).injector.get(BrnDrawer);
		return { view, drawer };
	}

	it('marks only the trigger that opened the drawer as expanded', async () => {
		const { view } = await setup();

		byTestId('second').click();
		view.detectChanges();
		await wait(50);

		expect(byTestId('first').getAttribute('aria-expanded')).toBe('false');
		expect(byTestId('second').getAttribute('aria-expanded')).toBe('true');
	});

	it('clears the payload and the active trigger once the drawer closes', async () => {
		const { view, drawer } = await setup();

		byTestId('first').click();
		view.detectChanges();
		await wait(50);
		expect(drawer.payload()).toBe('first');

		drawer.close();
		view.detectChanges();
		await wait(100);

		expect(drawer.payload()).toBeUndefined();
		expect(drawer.activeTrigger()).toBeNull();
	});

	it('focuses the popup by default', async () => {
		const { view, drawer } = await setup();

		drawer.open();
		view.detectChanges();
		await wait(50);

		expect(document.activeElement).toBe(byTestId('popup'));
	});

	it('keeps an explicit autoFocus target, even the dialog default one', async () => {
		const { view, drawer } = await setup({ autoFocus: 'first-tabbable' });

		drawer.open();
		view.detectChanges();
		await wait(50);

		expect(document.activeElement).toBe(byTestId('input'));
	});
});
