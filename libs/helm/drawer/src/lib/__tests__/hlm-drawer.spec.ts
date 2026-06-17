import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmDrawerImports } from '../../index';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-drawer-host',
	imports: [HlmDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer [direction]="direction()">
			<button hlmDrawerTrigger>Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<h3 hlmDrawerTitle>Edit Profile</h3>
				<button hlmDrawerClose data-testid="close">Cancel</button>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
class DrawerHost {
	public readonly direction = input<'bottom' | 'top' | 'left' | 'right'>('bottom');
}

const trigger = () => document.querySelector('button[hlmDrawerTrigger]') as HTMLButtonElement;
const content = () => document.querySelector('[hlmdrawercontent], hlm-drawer-content') as HTMLElement | null;
const backdrop = () => document.querySelector('.cdk-overlay-backdrop');
const globalWrapper = () => document.querySelector('.cdk-global-overlay-wrapper') as HTMLElement | null;

describe('HlmDrawer', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('opens with content and a (modal) backdrop, and closes via the close button', async () => {
		const view = await render(DrawerHost);

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(content()).toBeTruthy();
		expect(content()?.textContent).toContain('Edit Profile');
		expect(backdrop()).toBeTruthy();

		fireEvent.click(document.querySelector('[data-testid="close"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(content()).toBeNull();
	});

	it('closes on Escape', async () => {
		const view = await render(DrawerHost);

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();
		expect(content()).toBeTruthy();

		fireEvent.keyDown(document.querySelector('.cdk-overlay-pane') as HTMLElement, { key: 'Escape' });
		view.detectChanges();
		await flush();

		expect(content()).toBeNull();
	});

	// getPositionStrategy() override: each direction anchors the drawer to the matching screen edge
	// via a CDK global position strategy. The wrapper's flex alignment reflects the chosen edge.
	it('anchors to the bottom edge by default', async () => {
		const view = await render(DrawerHost);

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(globalWrapper()?.style.alignItems).toBe('flex-end');
	});

	it('anchors to the right edge when direction="right"', async () => {
		const view = await render(DrawerHost, { inputs: { direction: 'right' } });

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(globalWrapper()?.style.justifyContent).toBe('flex-end');
	});

	it('anchors to the left edge when direction="left"', async () => {
		const view = await render(DrawerHost, { inputs: { direction: 'left' } });

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(globalWrapper()?.style.justifyContent).toBe('flex-start');
	});

	it('anchors to the top edge when direction="top"', async () => {
		const view = await render(DrawerHost, { inputs: { direction: 'top' } });

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();

		expect(globalWrapper()?.style.alignItems).toBe('flex-start');
	});
});
