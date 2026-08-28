import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import type { MockInstance } from 'vitest';
import { BrnMessageScroller } from './brn-message-scroller';
import { BrnMessageScrollerButton } from './brn-message-scroller-button';
import { BrnMessageScrollerContent } from './brn-message-scroller-content';
import { BrnMessageScrollerItem } from './brn-message-scroller-item';
import { BrnMessageScrollerProvider } from './brn-message-scroller-provider';
import { BrnMessageScrollerRoot } from './brn-message-scroller-root';
import { BrnMessageScrollerViewport } from './brn-message-scroller-viewport';

type FixtureMessage = {
	id: string;
	anchor?: boolean;
	height?: number;
};

/** Injects the controller from inside the provider scope. */
@Component({
	selector: 'brn-message-scroller-probe',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
class MessageScrollerProbe {
	public readonly scroller = inject(BrnMessageScroller);
}

@Component({
	imports: [
		BrnMessageScrollerProvider,
		BrnMessageScrollerRoot,
		BrnMessageScrollerViewport,
		BrnMessageScrollerContent,
		BrnMessageScrollerItem,
		BrnMessageScrollerButton,
		MessageScrollerProbe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnMessageScrollerProvider [autoScroll]="autoScroll()" [defaultScrollPosition]="defaultScrollPosition()">
			<brn-message-scroller-probe />
			<div brnMessageScroller data-testid="root">
				<div brnMessageScrollerViewport data-testid="viewport" style="height: 200px; overflow: auto">
					<div brnMessageScrollerContent data-testid="content">
						@for (m of messages(); track m.id) {
							<div
								brnMessageScrollerItem
								[messageId]="m.id"
								[scrollAnchor]="m.anchor ?? false"
								[attr.data-testid]="'item-' + m.id"
								[style.height.px]="m.height ?? 80"
							>
								{{ m.id }}
							</div>
						}
					</div>
				</div>
				<button brnMessageScrollerButton direction="end" data-testid="scroll-end">End</button>
				<button brnMessageScrollerButton direction="start" data-testid="scroll-start">Start</button>
			</div>
		</div>
	`,
})
class MessageScrollerHost {
	public readonly probe = viewChild.required(MessageScrollerProbe);
	public readonly messages = signal<FixtureMessage[]>([
		{ id: '1', anchor: true, height: 80 },
		{ id: '2', height: 80 },
		{ id: '3', anchor: true, height: 80 },
		{ id: '4', height: 80 },
		{ id: '5', height: 80 },
	]);
	public readonly autoScroll = signal(true);
	public readonly defaultScrollPosition = signal<'start' | 'end' | 'last-anchor'>('end');

	public get scroller(): BrnMessageScroller {
		return this.probe().scroller;
	}
}

function stubViewportLayout(
	viewport: HTMLElement,
	content: HTMLElement,
	options: { clientHeight: number; contentHeight: number; scrollTop?: number },
) {
	let scrollTop = options.scrollTop ?? viewport.scrollTop ?? 0;

	Object.defineProperty(viewport, 'clientHeight', {
		configurable: true,
		get: () => options.clientHeight,
	});
	Object.defineProperty(viewport, 'scrollHeight', {
		configurable: true,
		get: () => options.contentHeight,
	});
	Object.defineProperty(viewport, 'scrollTop', {
		configurable: true,
		get: () => scrollTop,
		set: (value: number) => {
			scrollTop = value;
		},
	});

	viewport.scrollTo = ((opts: ScrollToOptions | number) => {
		if (typeof opts === 'number') {
			scrollTop = opts;
			return;
		}
		if (typeof opts.top === 'number') {
			scrollTop = opts.top;
		}
	}) as typeof viewport.scrollTo;

	viewport.getBoundingClientRect = () =>
		({
			top: 0,
			bottom: options.clientHeight,
			height: options.clientHeight,
			left: 0,
			right: 300,
			width: 300,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		}) as DOMRect;

	const refreshItemRects = () => {
		const items = Array.from(content.children).filter(
			(child): child is HTMLElement =>
				child instanceof HTMLElement && !child.hasAttribute('data-message-scroller-spacer'),
		);

		let offset = 0;
		for (const item of items) {
			const height = Number.parseFloat(item.style.height) || 80;
			const top = offset - scrollTop;
			item.getBoundingClientRect = () =>
				({
					top,
					bottom: top + height,
					height,
					left: 0,
					right: 300,
					width: 300,
					x: 0,
					y: top,
					toJSON: () => ({}),
				}) as DOMRect;
			offset += height;
		}
	};

	refreshItemRects();

	return {
		refreshItemRects,
		getScrollTop: () => scrollTop,
	};
}

describe('BrnMessageScroller', () => {
	let rafSpy: MockInstance;

	beforeEach(() => {
		rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0);
			return 0;
		});
	});

	afterEach(() => {
		rafSpy.mockRestore();
	});

	async function setup(overrides?: {
		messages?: FixtureMessage[];
		autoScroll?: boolean;
		defaultScrollPosition?: 'start' | 'end' | 'last-anchor';
		contentHeight?: number;
	}) {
		const view = await render(MessageScrollerHost);
		const host = view.fixture.componentInstance;

		if (overrides?.messages) {
			host.messages.set(overrides.messages);
		}
		if (overrides?.autoScroll !== undefined) {
			host.autoScroll.set(overrides.autoScroll);
		}
		if (overrides?.defaultScrollPosition) {
			host.defaultScrollPosition.set(overrides.defaultScrollPosition);
		}

		view.detectChanges();
		await view.fixture.whenStable();
		view.detectChanges();

		const viewport = document.querySelector('[data-testid="viewport"]') as HTMLElement;
		const content = document.querySelector('[data-testid="content"]') as HTMLElement;
		const contentHeight = overrides?.contentHeight ?? 400;
		const layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight });

		host.scroller.handleContentChange();
		host.scroller.syncAfterScroll();
		view.detectChanges();

		return { ...view, host, viewport, content, layout };
	}

	it('scrollToEnd moves the viewport to max scroll and updates scrollable edges', async () => {
		const { host, layout } = await setup({ contentHeight: 500 });

		expect(host.scroller.scrollToEnd({ behavior: 'auto' })).toBe(true);
		host.scroller.syncAfterScroll();

		expect(layout.getScrollTop()).toBe(300);
		expect(host.scroller.scrollable().end).toBe(false);
		expect(host.scroller.scrollable().start).toBe(true);
	});

	it('scrollToStart resets scrollTop to zero', async () => {
		const { host, layout } = await setup({ contentHeight: 500 });

		host.scroller.scrollToEnd({ behavior: 'auto' });
		expect(host.scroller.scrollToStart({ behavior: 'auto' })).toBe(true);
		host.scroller.syncAfterScroll();

		expect(layout.getScrollTop()).toBe(0);
		expect(host.scroller.scrollable().start).toBe(false);
	});

	it('scrollToMessage targets a registered item', async () => {
		const { host } = await setup({ autoScroll: false, contentHeight: 500 });

		expect(host.scroller.scrollToMessage('3', { behavior: 'auto' })).toBe(true);
		expect(document.querySelector('[data-testid="item-3"]')).toBeTruthy();
	});

	it('exposes a default aria-label on jump buttons', async () => {
		await setup();

		expect(document.querySelector('[data-testid="scroll-end"]')?.getAttribute('aria-label')).toBe('Scroll to end');
		expect(document.querySelector('[data-testid="scroll-start"]')?.getAttribute('aria-label')).toBe('Scroll to start');
	});

	it('mirrors direction on jump buttons', async () => {
		await setup();

		expect(document.querySelector('[data-testid="scroll-end"]')?.getAttribute('data-direction')).toBe('end');
		expect(document.querySelector('[data-testid="scroll-start"]')?.getAttribute('data-direction')).toBe('start');
	});

	it('marks the end button inactive at the bottom and scrolls on click when active', async () => {
		// autoScroll off so follow-bottom does not suppress published `end` after a jump.
		const { host, viewport, layout, detectChanges } = await setup({ autoScroll: false, contentHeight: 500 });

		host.scroller.scrollToEnd({ behavior: 'auto' });
		host.scroller.syncAfterScroll();
		detectChanges();

		const endButton = document.querySelector('[data-testid="scroll-end"]') as HTMLButtonElement;
		expect(endButton.getAttribute('data-active')).toBe('false');

		viewport.scrollTop = 50;
		layout.refreshItemRects();
		host.scroller.syncAfterScroll();
		detectChanges();

		expect(endButton.getAttribute('data-active')).toBe('true');

		endButton.click();
		host.scroller.syncAfterScroll();
		expect(layout.getScrollTop()).toBe(300);
	});

	it('userScrollIntent releases follow-bottom so append reconcile does not force the end', async () => {
		const { host, viewport, content } = await setup({ autoScroll: true, contentHeight: 500 });

		host.scroller.scrollToEnd({ behavior: 'auto' });
		host.scroller.userScrollIntent();

		let layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight: 500, scrollTop: 40 });
		host.scroller.syncAfterScroll();
		const before = layout.getScrollTop();

		const el = document.createElement('div');
		el.dataset['messageId'] = '6';
		el.dataset['scrollAnchor'] = 'false';
		el.style.height = '80px';
		content.insertBefore(el, content.querySelector('[data-message-scroller-spacer]'));
		host.scroller.registerMessage('6', el);
		layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight: 580, scrollTop: before });
		host.scroller.handleContentChange();
		host.scroller.syncAfterScroll();

		expect(layout.getScrollTop()).toBe(before);
	});

	it('rebuilds the visibility observer when scrollMargin or peek changes', async () => {
		const rootMargins: string[] = [];
		const OriginalIO = window.IntersectionObserver;

		class FakeIntersectionObserver {
			constructor(_cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
				rootMargins.push(options?.rootMargin ?? '');
			}
			observe(): void {
				/* noop */
			}
			unobserve(): void {
				/* noop */
			}
			disconnect(): void {
				/* noop */
			}
			takeRecords(): IntersectionObserverEntry[] {
				return [];
			}
			public readonly root = null;
			public readonly rootMargin = '';
			public readonly thresholds: readonly number[] = [];
		}

		window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;

		try {
			const { host } = await setup({ autoScroll: false, contentHeight: 500 });

			host.scroller.observeVisibility();
			expect(rootMargins.at(-1)).toBe('-64px 0px 0px 0px'); // default peek 64 + margin 0

			host.scroller.configure({ scrollMargin: 24, scrollPreviousItemPeek: 80 });
			expect(rootMargins).toHaveLength(2);
			expect(rootMargins.at(-1)).toBe('-104px 0px 0px 0px'); // -(24 + 80)
		} finally {
			window.IntersectionObserver = OriginalIO;
		}
	});

	it('recommits scrollable when scrollEdgeThreshold changes', async () => {
		const { host, viewport, content } = await setup({ autoScroll: false, contentHeight: 500 });

		// Five 80px rows → contentBottom 400. scrollTop 195 leaves 5px below the fold.
		const layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight: 500, scrollTop: 195 });
		layout.refreshItemRects();
		host.scroller.syncAfterScroll();

		expect(host.scroller.scrollable().end).toBe(false);

		host.scroller.configure({ scrollEdgeThreshold: 2 });

		expect(host.scroller.scrollable().end).toBe(true);
	});

	it('ignores public commands after destroy', async () => {
		const { host } = await setup({ autoScroll: true, contentHeight: 500 });
		const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

		host.scroller.destroy();

		expect(host.scroller.scrollToEnd({ behavior: 'auto' })).toBe(false);
		expect(host.scroller.scrollToStart({ behavior: 'auto' })).toBe(false);
		expect(host.scroller.scrollToMessage('1')).toBe(false);
		host.scroller.observeVisibility();

		expect(setTimeoutSpy).not.toHaveBeenCalled();
		setTimeoutSpy.mockRestore();
	});

	it('preserveScrollOnPrepend restores scroll when earlier rows are inserted', async () => {
		const { host, content, viewport } = await setup({
			autoScroll: false,
			contentHeight: 600,
			messages: [
				{ id: 'a', height: 80 },
				{ id: 'b', height: 80 },
				{ id: 'c', height: 80 },
				{ id: 'd', height: 80 },
			],
		});

		let layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight: 600, scrollTop: 100 });
		host.scroller.syncAfterScroll();
		host.scroller.handleContentChange();
		const before = layout.getScrollTop();

		const first = content.querySelector('[data-testid="item-a"]') as HTMLElement;
		for (const id of ['pre-1', 'pre-2'].reverse()) {
			const el = document.createElement('div');
			el.dataset['messageId'] = id;
			el.dataset['scrollAnchor'] = 'false';
			el.style.height = '80px';
			content.insertBefore(el, first);
			host.scroller.registerMessage(id, el);
		}

		layout = stubViewportLayout(viewport, content, { clientHeight: 200, contentHeight: 760, scrollTop: before });
		host.scroller.handleContentChange();

		expect(layout.getScrollTop()).toBeGreaterThanOrEqual(before);
	});
});
