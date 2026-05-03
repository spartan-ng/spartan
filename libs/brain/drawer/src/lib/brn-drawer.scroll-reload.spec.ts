// Pins the scroll regression that real-world consumers (e.g. a deposit drawer
// switching network) hit when the body grows past the viewport via a pure
// `characterData` mutation: no DOM-structure change, just a longer string in
// the same text node. The original `MutationObserver` config (`childList: true`
// alone) ignores that mutation, the scroller's `touch-action` stays at
// `'none'`, and native scroll silently dies. The fix swaps the lone MO for a
// `ResizeObserver` per direct child so any size change refreshes scroll
// detection regardless of cause.
//
// jsdom doesn't compute layout, so we override `scrollHeight` / `clientHeight`
// on the scroller and replace the global `ResizeObserver` mock with a
// controllable one that fires on demand.

import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDrawer } from './brn-drawer';
import { BrnDrawerContent } from './brn-drawer-content';
import { BrnDrawerScroller } from './brn-drawer-scroller';

const noop = (): void => undefined;

const observerCallbacks = new Set<{ cb: ResizeObserverCallback; targets: Set<Element> }>();

function flushResizes(): void {
	for (const { cb, targets } of observerCallbacks) {
		if (targets.size === 0) continue;
		const entries = Array.from(targets, (target) => ({
			target,
			contentRect: target.getBoundingClientRect(),
		})) as ResizeObserverEntry[];
		cb(entries, {} as ResizeObserver);
	}
}

beforeAll(() => {
	// Replace the brain test-setup's no-op ResizeObserver with one that records
	// observed targets so `flushResizes()` can fire the callbacks on demand.
	Object.defineProperty(globalThis, 'ResizeObserver', {
		configurable: true,
		writable: true,
		value: class FakeResizeObserver {
			private readonly _entry: { cb: ResizeObserverCallback; targets: Set<Element> };
			constructor(cb: ResizeObserverCallback) {
				this._entry = { cb, targets: new Set<Element>() };
				observerCallbacks.add(this._entry);
			}
			observe(target: Element): void {
				this._entry.targets.add(target);
			}
			unobserve(target: Element): void {
				this._entry.targets.delete(target);
			}
			disconnect(): void {
				this._entry.targets.clear();
				observerCallbacks.delete(this._entry);
			}
		},
	});
	if (typeof window !== 'undefined' && !window.matchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: noop,
				removeListener: noop,
				addEventListener: noop,
				removeEventListener: noop,
				dispatchEvent: () => false,
			}),
		});
	}
});

@Component({
	selector: 'brn-drawer-scroll-reload-test-host',
	imports: [BrnDrawer, BrnDrawerContent, BrnDrawerScroller],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnDrawer
			[isOpen]="isOpen()"
			[disableScrollLocking]="true"
			[avoidKeyboard]="false"
			[tweenConfig]="{ ease: 'linear', duration: 0 }"
		>
			<div brnDrawerContent>
				<div brnDrawerScroller #scroller>
					<!-- Stable structure, text-only updates: matches the real-world
					     "switch network → same wrapper, different inner text" pattern. -->
					<div data-test-body>{{ body() }}</div>
				</div>
			</div>
		</div>
	`,
})
class TestHost {
	public readonly isOpen = signal(false);
	public readonly body = signal('');
	public readonly scroller = viewChild('scroller', { read: ElementRef<HTMLElement> });
}

interface MockedScroller {
	el: HTMLElement;
	setScrollHeight: (px: number) => void;
}

function mockScrollerDimensions(el: HTMLElement, clientHeightPx: number): MockedScroller {
	let scrollHeight = 0;
	Object.defineProperty(el, 'clientHeight', {
		configurable: true,
		get: () => clientHeightPx,
	});
	Object.defineProperty(el, 'scrollHeight', {
		configurable: true,
		get: () => scrollHeight,
	});
	Object.defineProperty(el, 'scrollTop', {
		configurable: true,
		get: () => 0,
	});
	return {
		el,
		setScrollHeight(px: number): void {
			scrollHeight = px;
		},
	};
}

async function flushMutations(): Promise<void> {
	await new Promise<void>((r) => setTimeout(r, 0));
	flushResizes();
	await new Promise<void>((r) => setTimeout(r, 0));
}

describe('BrnDrawer — scroller touch-action across content reload', () => {
	let fixture: ReturnType<typeof TestBed.createComponent<TestHost>>;

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [TestHost] });
		fixture = TestBed.createComponent(TestHost);
		fixture.detectChanges();
		fixture.componentInstance.isOpen.set(true);
		fixture.detectChanges();
		// Drawer's handleOpen waits for one rAF before measuring. Wait for it.
		await new Promise<void>((r) => requestAnimationFrame(() => r()));
		await fixture.whenStable();
		fixture.detectChanges();
	});

	afterEach(() => {
		fixture.destroy();
	});

	it('refreshes touch-action when text-only content (no childList mutation) changes scrollability', async () => {
		const host = fixture.componentInstance;
		const scrollerEl = host.scroller()!.nativeElement;

		// Viewport-bound scroller of 500px.
		const scroller = mockScrollerDimensions(scrollerEl, 500);

		// Step 1 — short content fits in the viewport. Body interpolation
		// populates a single text node; no DOM structure changes.
		scroller.setScrollHeight(300);
		host.body.set('short text');
		fixture.detectChanges();
		await flushMutations();
		fixture.detectChanges();
		expect(scrollerEl.style.touchAction).toBe('none');

		// Step 2 — body grows past the viewport via the same text node. This is a
		// `characterData` mutation, NOT a `childList` mutation. The pre-fix code
		// missed it entirely and left `touch-action: 'none'` stuck on the scroller.
		scroller.setScrollHeight(900);
		host.body.set('a much longer string that would overflow the viewport in the real DOM'.repeat(10));
		fixture.detectChanges();
		await flushMutations();
		fixture.detectChanges();
		expect(scrollerEl.style.touchAction).toBe('');
	});
});
