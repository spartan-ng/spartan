import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawerProvider } from './brn-drawer-provider';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const byTestId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

@Component({
	selector: 'brn-drawer-provider-multiple-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerProvider>
			<div brnDrawerIndentBackground data-testid="background"></div>
			<div brnDrawer [modal]="false" [state]="firstOpen() ? 'open' : 'closed'">
				<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>First drawer</div></div>
			</div>
			@if (showSecond()) {
				<div brnDrawer [modal]="false" [state]="secondOpen() ? 'open' : 'closed'">
					<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Second drawer</div></div>
				</div>
			}
		</div>
	`,
})
class MultipleDrawersHost {
	public readonly firstOpen = input(false);
	public readonly secondOpen = input(false);
	public readonly showSecond = input(true);
}

@Component({
	selector: 'brn-drawer-provider-registry-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerProvider>
			<div brnDrawerIndentBackground data-testid="background"></div>
			@if (showIndent()) {
				<div brnDrawerIndent data-testid="indent"></div>
			}
		</div>
	`,
})
class RegistryHost {
	public readonly showIndent = input(true);
}

@Component({
	selector: 'brn-drawer-provider-standalone-indent-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerIndent data-testid="indent"></div>
		<div brnDrawerIndentBackground data-testid="background"></div>
	`,
})
class StandaloneIndentHost {}

@Component({
	selector: 'brn-drawer-indent-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerProvider>
			<div brnDrawerIndentBackground data-testid="bg"></div>
			<div brnDrawerIndent data-testid="indent">
				<div brnDrawer [state]="open() ? 'open' : 'closed'">
					<button brnDrawerTrigger>Open</button>
					<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Drawer</div></div>
				</div>
			</div>
		</div>
	`,
})
class IndentHost {
	public readonly open = input(false);
}

@Component({
	selector: 'brn-drawer-indent-background-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerProvider>
			<div brnDrawerIndentBackground data-testid="bg"></div>
			<div brnDrawer [state]="open() ? 'open' : 'closed'">
				<button brnDrawerTrigger>Open</button>
				<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Drawer</div></div>
			</div>
		</div>
	`,
})
class IndentBackgroundHost {
	public readonly open = input(false);
}

@Component({
	selector: 'brn-drawer-content-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup>
					<div brnDrawerContent data-testid="content">Content</div>
				</div>
			</div>
		</div>
	`,
})
class ContentHost {}

describe('BrnDrawerProvider', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('stays active until every open drawer is closed or removed', async () => {
		const view = await render(MultipleDrawersHost);
		const background = byTestId('background');

		expect(background).toHaveAttribute('data-inactive', '');

		const setProps = async (props: { firstOpen: boolean; secondOpen: boolean; showSecond: boolean }) => {
			await view.rerender({ inputs: props, partialUpdate: true });
			view.detectChanges();
			await wait(20);
			view.detectChanges();
		};

		await setProps({ firstOpen: true, secondOpen: false, showSecond: true });
		expect(background).toHaveAttribute('data-active', '');

		await setProps({ firstOpen: false, secondOpen: true, showSecond: true });
		expect(background).toHaveAttribute('data-active', '');

		await setProps({ firstOpen: false, secondOpen: true, showSecond: false });
		expect(background).toHaveAttribute('data-inactive', '');
	});

	it('ignores redundant registry updates without disturbing active state', async () => {
		const view = await render(RegistryHost);
		const provider = view.fixture.debugElement.query(By.directive(BrnDrawerProvider)).injector.get(BrnDrawerProvider);
		const background = byTestId('background');
		const manualDrawer = {};
		const missingDrawer = {};

		provider.setDrawerOpen(manualDrawer, true);
		view.detectChanges();
		expect(background).toHaveAttribute('data-active', '');

		provider.setDrawerOpen(manualDrawer, true);
		provider.removeDrawer(missingDrawer);
		view.detectChanges();
		expect(background).toHaveAttribute('data-active', '');

		provider.setDrawerOpen(manualDrawer, false);
		view.detectChanges();
		expect(background).toHaveAttribute('data-inactive', '');

		provider.removeDrawer(manualDrawer);
		provider.removeDrawer(manualDrawer);
		view.detectChanges();
		expect(background).toHaveAttribute('data-inactive', '');
	});

	it('synchronizes and restores visual state on brnDrawerIndent', async () => {
		const view = await render(RegistryHost);
		const provider = view.fixture.debugElement.query(By.directive(BrnDrawerProvider)).injector.get(BrnDrawerProvider);
		const store = provider.visualStateStore;
		const indent = byTestId('indent');

		store.set({ swipeProgress: 0.5, frontmostHeight: 120 });
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0.5');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('120px');

		store.set({ swipeProgress: 0 });
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('120px');

		store.set({ frontmostHeight: 0 });
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('');

		store.set({ swipeProgress: Number.NaN, frontmostHeight: Infinity });
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('');

		// Destroying the indent resets the styles it wrote.
		store.set({ swipeProgress: 0.5, frontmostHeight: 120 });
		await view.rerender({ inputs: { showIndent: false }, partialUpdate: true });
		view.detectChanges();
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('');
	});

	it('allows indent parts to render without a provider', async () => {
		await render(StandaloneIndentHost);

		expect(byTestId('indent')).toHaveAttribute('data-inactive', '');
		expect(byTestId('background')).toHaveAttribute('data-inactive', '');
	});
});

describe('BrnDrawerContent', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('does not add public swipe-ignore attributes', async () => {
		const view = await render(ContentHost);
		view.detectChanges();
		await wait(50);

		const content = byTestId('content');
		expect(content).toBeTruthy();
		expect(content).not.toHaveAttribute('data-swipe-ignore');
		expect(content).not.toHaveAttribute('data-base-ui-swipe-ignore');
	});
});

describe('BrnDrawerIndent', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('sets data-active when any drawer is open', async () => {
		const view = await render(IndentHost);

		expect(byTestId('indent')).toHaveAttribute('data-inactive', '');
		expect(byTestId('indent')).not.toHaveAttribute('data-active');

		await view.rerender({ inputs: { open: true }, partialUpdate: true });
		view.detectChanges();
		await wait(20);
		view.detectChanges();

		expect(byTestId('indent')).toHaveAttribute('data-active', '');
		expect(byTestId('indent')).not.toHaveAttribute('data-inactive');
		expect(byTestId('bg')).toHaveAttribute('data-active', '');
	});
});

describe('BrnDrawerIndentBackground', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('sets data-active when any drawer is open', async () => {
		const view = await render(IndentBackgroundHost);
		const background = byTestId('bg');

		expect(background.getAttribute('data-inactive')).toBe('');
		expect(background.getAttribute('data-active')).toBeNull();

		await view.rerender({ inputs: { open: true }, partialUpdate: true });
		view.detectChanges();
		await wait(20);
		view.detectChanges();

		expect(background.getAttribute('data-active')).toBe('');
		expect(background.getAttribute('data-inactive')).toBeNull();
	});
});
