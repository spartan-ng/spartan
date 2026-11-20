import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawer } from './brn-drawer';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
	selector: 'brn-drawer-virtual-keyboard-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer brnDrawerVirtualKeyboardProvider>
			<div *brnDrawerPortal brnDrawerViewport style="position: fixed; inset: 0">
				<div brnDrawerPopup style="position: fixed; inset-inline: 0; bottom: 0; height: 300px">
					<div brnDrawerContent>
						<input data-testid="input" (click)="clicks = clicks + 1" />
					</div>
				</div>
			</div>
		</div>
	`,
})
class VirtualKeyboardHost {
	public clicks = 0;
}

function touch(target: Element, type: string, x: number, y: number) {
	const point = new Touch({ identifier: 1, target, clientX: x, clientY: y });
	const ended = type === 'touchend';
	target.dispatchEvent(
		new TouchEvent(type, {
			bubbles: true,
			cancelable: true,
			composed: true,
			touches: ended ? [] : [point],
			targetTouches: ended ? [] : [point],
			changedTouches: [point],
		}),
	);
}

describe('BrnDrawerVirtualKeyboardProvider', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	async function openDrawer() {
		const view = await render(VirtualKeyboardHost);
		view.fixture.debugElement.query(By.directive(BrnDrawer)).injector.get(BrnDrawer).open();
		view.detectChanges();
		await wait(50);
		const input = document.querySelector('[data-testid="input"]') as HTMLInputElement;
		const rect = input.getBoundingClientRect();
		return { view, input, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
	}

	it('focuses the tapped input inside the touch gesture and redispatches its click', async () => {
		const { view, input, x, y } = await openDrawer();
		(document.activeElement as HTMLElement | null)?.blur();

		touch(input, 'touchstart', x, y);
		touch(input, 'touchend', x, y);

		expect(document.activeElement).toBe(input);
		expect(view.fixture.componentInstance.clicks).toBe(1);
	});

	it('treats a drag as a scroll, not a tap', async () => {
		const { input, x, y } = await openDrawer();
		(document.activeElement as HTMLElement | null)?.blur();

		touch(input, 'touchstart', x, y);
		touch(input, 'touchmove', x, y + 40);
		touch(input, 'touchend', x, y + 40);

		expect(document.activeElement).not.toBe(input);
	});
});
