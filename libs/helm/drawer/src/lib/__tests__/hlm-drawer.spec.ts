import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmDrawerImports } from '../../index';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-drawer-host',
	imports: [HlmDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer [swipeDirection]="swipeDirection()" [modal]="modal()" [showSwipeHandle]="showSwipeHandle()">
			<button hlmDrawerTrigger>Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx" class="custom-popup-class">
				<h3 hlmDrawerTitle>Edit Profile</h3>
				<button hlmDrawerClose data-testid="close">Cancel</button>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
class DrawerHost {
	public readonly swipeDirection = input<'down' | 'up' | 'left' | 'right'>('down');
	public readonly modal = input<boolean | 'trap-focus'>(true);
	public readonly showSwipeHandle = input(false);
}

@Component({
	selector: 'hlm-drawer-nested-host',
	imports: [HlmDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer>
			<button hlmDrawerTrigger data-testid="outer-trigger">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal>
				<hlm-drawer swipeDirection="right">
					<button hlmDrawerTrigger data-testid="nested-trigger">Open Nested</button>
					<hlm-drawer-content *hlmDrawerPortal>
						<button hlmDrawerClose data-testid="nested-close">Close</button>
					</hlm-drawer-content>
				</hlm-drawer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
class NestedDrawerHost {}

const trigger = () => document.querySelector('button[hlmDrawerTrigger]') as HTMLButtonElement;
const popups = () => Array.from(document.querySelectorAll<HTMLElement>('[data-slot="drawer-popup"]'));
const popup = () => popups()[0] ?? null;
const backdrop = () => document.querySelector('.cdk-overlay-backdrop');

async function openDrawer(view: Awaited<ReturnType<typeof render>>, button = trigger()) {
	fireEvent.click(button);
	view.detectChanges();
	await flush();
	view.detectChanges();
}

describe('HlmDrawer', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('renders viewport, popup and content, with a modal backdrop, and closes via the close button', async () => {
		const view = await render(DrawerHost);
		await openDrawer(view);

		expect(document.querySelector('[data-slot="drawer-viewport"] > [data-slot="drawer-popup"]')).toBeTruthy();
		expect(popup()?.querySelector('[data-slot="drawer-content"][data-drawer-content]')?.textContent).toContain(
			'Edit Profile',
		);
		expect(backdrop()).toBeTruthy();

		fireEvent.click(document.querySelector('[data-testid="close"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(popup()).toBeNull();
	});

	it('closes on Escape', async () => {
		const view = await render(DrawerHost);
		await openDrawer(view);
		expect(popup()).toBeTruthy();

		fireEvent.keyDown(document.querySelector('.cdk-overlay-pane') as HTMLElement, { key: 'Escape' });
		view.detectChanges();
		await flush();

		expect(popup()).toBeNull();
	});

	it('applies the content class to the popup and exposes the swipe direction and axis', async () => {
		const view = await render(DrawerHost, { inputs: { swipeDirection: 'left' } });
		await openDrawer(view);

		expect(popup()?.classList).toContain('custom-popup-class');
		expect(popup()?.getAttribute('data-swipe-direction')).toBe('left');
		expect(popup()?.getAttribute('data-swipe-axis')).toBe('x');
	});

	it('focuses the popup when it opens', async () => {
		const view = await render(DrawerHost);
		await openDrawer(view);

		expect(document.activeElement).toBe(popup());
	});

	it('renders the swipe handle only with showSwipeHandle', async () => {
		const view = await render(DrawerHost);
		await openDrawer(view);
		expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull();
		fireEvent.keyDown(document.querySelector('.cdk-overlay-pane') as HTMLElement, { key: 'Escape' });
		await flush();

		view.fixture.componentRef.setInput('showSwipeHandle', true);
		await openDrawer(view);
		expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeTruthy();
	});

	it('has no backdrop and no scroll lock when not modal', async () => {
		const view = await render(DrawerHost, { inputs: { modal: false } });
		await openDrawer(view);

		expect(popup()).toBeTruthy();
		expect(backdrop()).toBeNull();
		expect(document.documentElement.classList).not.toContain('cdk-global-scrollblock');
	});

	it('marks the parent while a nested drawer is open and keeps each drawer direction', async () => {
		const view = await render(NestedDrawerHost);
		await openDrawer(view, document.querySelector('[data-testid="outer-trigger"]') as HTMLButtonElement);
		await openDrawer(view, document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);

		const [parent, nested] = popups();
		expect(parent.getAttribute('data-swipe-direction')).toBe('down');
		expect(nested.getAttribute('data-swipe-direction')).toBe('right');
		expect(nested.hasAttribute('data-nested')).toBe(true);
		expect(parent.hasAttribute('data-nested-drawer-open')).toBe(true);
		expect(parent.style.getPropertyValue('--nested-drawers')).toBe('1');

		fireEvent.click(document.querySelector('[data-testid="nested-close"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();
		view.detectChanges();

		expect(popups()).toHaveLength(1);
		expect(popup()?.hasAttribute('data-nested-drawer-open')).toBe(false);
		expect(popup()?.style.getPropertyValue('--nested-drawers')).toBe('0');
	});
});
