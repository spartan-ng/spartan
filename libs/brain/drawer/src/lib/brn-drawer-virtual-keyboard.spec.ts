import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, inject, Injectable, type Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawer } from './brn-drawer';
import { BRN_DRAWER_VIRTUAL_KEYBOARD } from './brn-drawer-virtual-keyboard';

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

/** An input wired straight to the provider's touch hooks, bypassing the viewport's gating. */
@Component({
	selector: 'brn-drawer-direct-keyboard-touch-target',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input
			data-testid="input"
			type="text"
			(touchstart)="_keyboard?.onTouchStart($event)"
			(touchend)="_keyboard?.onTouchEnd($event)"
		/>
	`,
})
class DirectVirtualKeyboardTouchTarget {
	protected readonly _keyboard = inject(BRN_DRAWER_VIRTUAL_KEYBOARD, { optional: true });
}

// Renders the overlay container inside a shadow root, standing in for Base UI's `Portal container`.
let overlayShadowRoot: ShadowRoot | null = null;

@Injectable()
class ShadowRootOverlayContainer extends OverlayContainer {
	protected override _createContainer(): void {
		const container = this._document.createElement('div');
		container.classList.add('cdk-overlay-container');
		(overlayShadowRoot ?? this._document.body).appendChild(container);
		this._containerElement = container;
	}
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

/** A `touchend` like the browser's: the lift point lives in `changedTouches` only. */
function createNativeTouchEnd(target: EventTarget, x: number, y: number) {
	const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
	Object.defineProperties(touchEnd, {
		changedTouches: { configurable: true, value: [new Touch({ identifier: 1, target, clientX: x, clientY: y })] },
		touches: { configurable: true, value: [] },
	});
	return touchEnd;
}

function createNativeTouchCancel(target: EventTarget, x: number, y: number) {
	const touchCancel = new Event('touchcancel', { bubbles: true, cancelable: true });
	Object.defineProperties(touchCancel, {
		changedTouches: { configurable: true, value: [new Touch({ identifier: 1, target, clientX: x, clientY: y })] },
		touches: { configurable: true, value: [] },
	});
	return touchCancel;
}

async function flushAnimationFrames(count: number) {
	for (let i = 0; i < count; i += 1) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
}

const box = (top: number, height: number) => new DOMRect(0, top, 320, height);

function mockScrollSize(element: HTMLElement, clientHeight: number, scrollHeight: number) {
	Object.defineProperties(element, {
		clientHeight: { configurable: true, value: clientHeight },
		scrollHeight: { configurable: true, value: scrollHeight },
	});
}

/** Applies `scrollTo({ top })` synchronously, so alignment asserts don't wait on a smooth scroll. */
function scrollInstantly(element: HTMLElement) {
	return (options?: ScrollToOptions | number) => {
		if (typeof options === 'object' && options !== null && options.top !== undefined) {
			element.scrollTop = options.top;
		}
	};
}

const centerOf = (rect: DOMRect) => (rect.top + rect.bottom) / 2;

describe('BrnDrawerVirtualKeyboardProvider', () => {
	const cleanups: (() => void)[] = [];

	afterEach(() => {
		cleanups
			.splice(0)
			.reverse()
			.forEach((cleanup) => cleanup());
		vi.restoreAllMocks();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	function mockVisualViewport(height: number) {
		const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'visualViewport');
		const listeners = new Map<string, Set<EventListener>>();
		const visualViewport = {
			height,
			offsetTop: 0,
			scale: 1,
			addEventListener(type: string, listener: EventListener) {
				if (!listeners.has(type)) listeners.set(type, new Set());
				listeners.get(type)?.add(listener);
			},
			removeEventListener(type: string, listener: EventListener) {
				listeners.get(type)?.delete(listener);
			},
		};
		Object.defineProperty(window, 'visualViewport', { configurable: true, value: visualViewport });
		cleanups.push(() => {
			if (originalDescriptor) Object.defineProperty(window, 'visualViewport', originalDescriptor);
			else delete (window as { visualViewport?: unknown }).visualViewport;
		});

		const emit = (type: string) => listeners.get(type)?.forEach((listener) => listener(new Event(type)));
		return {
			resize(nextHeight: number) {
				visualViewport.height = nextHeight;
				emit('resize');
			},
			setScale(nextScale: number) {
				visualViewport.scale = nextScale;
				emit('resize');
			},
			scroll(nextOffsetTop: number, nextHeight?: number) {
				visualViewport.offsetTop = nextOffsetTop;
				if (nextHeight !== undefined) visualViewport.height = nextHeight;
				emit('scroll');
			},
		};
	}

	function mockWindowProperty(
		name: 'innerHeight' | 'innerWidth' | 'scrollY' | 'PointerEvent' | 'visualViewport',
		value: unknown,
	) {
		const originalDescriptor = Object.getOwnPropertyDescriptor(window, name);
		Object.defineProperty(window, name, { configurable: true, value });
		cleanups.push(() => {
			if (originalDescriptor) Object.defineProperty(window, name, originalDescriptor);
		});
	}

	function mockResizableInnerHeight(initialHeight: number) {
		const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'innerHeight');
		let innerHeight = initialHeight;
		Object.defineProperty(window, 'innerHeight', { configurable: true, get: () => innerHeight });
		cleanups.push(() => {
			if (originalDescriptor) Object.defineProperty(window, 'innerHeight', originalDescriptor);
		});
		return {
			resize(nextHeight: number) {
				innerHeight = nextHeight;
				window.dispatchEvent(new Event('resize'));
			},
		};
	}

	function mockElementFromPoint(root: Document | ShadowRoot, resolve: (x: number, y: number) => Element | null): void {
		const original = root.elementFromPoint;
		root.elementFromPoint = resolve as typeof root.elementFromPoint;
		cleanups.push(() => (root.elementFromPoint = original));
	}

	function mockAndroid() {
		Object.defineProperty(navigator, 'userAgent', {
			configurable: true,
			get: () => 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36',
		});
		cleanups.push(() => delete (navigator as { userAgent?: string }).userAgent);
	}

	function useFakeTimers() {
		vi.useFakeTimers({
			toFake: [
				'setTimeout',
				'clearTimeout',
				'setInterval',
				'clearInterval',
				'requestAnimationFrame',
				'cancelAnimationFrame',
			],
		});
		cleanups.push(() => vi.useRealTimers());
	}

	interface DrawerOptions {
		modal?: boolean;
		/** Applies `brnDrawerVirtualKeyboardProvider` (Base UI's `Drawer.VirtualKeyboardProvider`). */
		provider?: boolean;
		/** The raw `autoFocus` binding; `'false'` matches Base UI's `initialFocus={false}`. */
		autoFocus?: string;
		popupAttributes?: string;
		/** Markup rendered next to the drawer, outside of it. */
		before?: string;
		providers?: Provider[];
	}

	/** Renders an open drawer whose popup holds `content`; the viewport and popup get test ids. */
	async function renderDrawer(content: string, options: DrawerOptions = {}) {
		const { modal = false, provider = true, autoFocus, popupAttributes = '', before = '' } = options;
		const view = await render(
			`
			${before}
			<div
				brnDrawer
				${provider ? 'brnDrawerVirtualKeyboardProvider' : ''}
				${modal ? '' : '[modal]="false"'}
				${autoFocus === undefined ? '' : `[autoFocus]="${autoFocus}"`}
			>
				<div *brnDrawerPortal brnDrawerViewport data-testid="viewport">
					<div brnDrawerPopup data-testid="popup" ${popupAttributes}>${content}</div>
				</div>
			</div>
			`,
			{
				imports: [...BrnDrawerImports, DirectVirtualKeyboardTouchTarget],
				providers: options.providers,
			},
		);
		const drawer = view.fixture.debugElement.query(By.directive(BrnDrawer)).injector.get(BrnDrawer);
		drawer.open();
		view.detectChanges();
		await wait(50);
		return { view, drawer };
	}

	/** A scrollable body below a tall spacer, like the Base UI fixtures: `<Drawer.Content>` + an input. */
	const scrollBody = (style: string, field = '<input data-testid="input" type="text" />') => `
		<div brnDrawerContent data-testid="scroll" style="${style}">
			<div style="height: 900px"></div>
			${field}
		</div>
	`;

	const getViewport = () => screen.getByTestId('viewport');
	const keyboardInset = () => getViewport().style.getPropertyValue('--drawer-keyboard-inset');

	describe('touch handling (real hit testing)', () => {
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

	describe('keyboard alignment', () => {
		it('compensates for keyboard overlap without adding extra spacing and centers the focused input', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; overflow-anchor: auto; padding-bottom: 20px'));
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);
			input.getBoundingClientRect = () => box(650 - scroll.scrollTop, 40);
			scroll.scrollTo = scrollInstantly(scroll) as typeof scroll.scrollTo;

			const keyboardViewportHeight = 500;
			input.focus();
			scroll.scrollTop = 0;
			visualViewport.resize(keyboardViewportHeight);

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('240px'));
			await waitFor(() => expect(scroll.style.scrollPaddingBottom).not.toBe(''));
			await waitFor(() => expect(scroll.style.overflowAnchor).toBe('none'));
			await waitFor(() => {
				const visibleCenter = (scroll.getBoundingClientRect().top + keyboardViewportHeight) / 2;
				expect(centerOf(input.getBoundingClientRect())).toBeCloseTo(visibleCenter, 0);
			});

			input.blur();

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('20px'));
			await waitFor(() => expect(scroll.style.scrollPaddingBottom).toBe(''));
			await waitFor(() => expect(scroll.style.overflowAnchor).toBe('auto'));
		});

		it('tops the scroll container padding up to the visibility margin below the overlap', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; padding-bottom: 0px'));
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);

			input.focus();
			visualViewport.resize(500);

			// 220px of overlap plus the 16px margin the container's own padding does not cover.
			await waitFor(() => expect(scroll.style.paddingBottom).toBe('236px'));

			input.blur();

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('0px'));
		});

		it('adds scroll slack to a light-DOM scroller for an input inside a shadow root', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(
				scrollBody(
					'height: 420px; overflow-y: auto; overflow-anchor: auto; padding-bottom: 20px',
					'<div data-testid="host"></div>',
				),
			);
			const scroll = screen.getByTestId('scroll');
			const shadowRoot = screen.getByTestId('host').attachShadow({ mode: 'open' });
			const input = document.createElement('input');
			input.type = 'text';
			shadowRoot.append(input);

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);
			input.getBoundingClientRect = () => box(650 - scroll.scrollTop, 40);
			scroll.scrollTo = scrollInstantly(scroll) as typeof scroll.scrollTo;

			const keyboardViewportHeight = 500;
			input.focus();
			scroll.scrollTop = 0;
			visualViewport.resize(keyboardViewportHeight);

			// Slack reaches the light-DOM scroller even though the input lives in a shadow root.
			await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(20));
			await waitFor(() => expect(scroll.style.overflowAnchor).toBe('none'));
			await waitFor(() => {
				const visibleCenter = (scroll.getBoundingClientRect().top + keyboardViewportHeight) / 2;
				expect(centerOf(input.getBoundingClientRect())).toBeCloseTo(visibleCenter, 0);
			});
		});

		it('adds keyboard scroll slack to a potential scroll ancestor for textareas', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<div data-testid="scroll" style="height: 420px; overflow-y: auto; padding-bottom: 20px">
					<div style="height: 300px"></div>
					<textarea data-testid="textarea"></textarea>
				</div>
			`);
			const scroll = screen.getByTestId('scroll');
			const textarea = screen.getByTestId('textarea');

			mockScrollSize(scroll, 420, 420);
			mockScrollSize(textarea, 88, 88);
			scroll.getBoundingClientRect = () => box(300, 420);
			textarea.getBoundingClientRect = () => box(650, 40);

			textarea.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(20));
			await waitFor(() => expect(textarea.style.paddingBottom).toBe(''));
		});

		it('adds keyboard scroll slack to the scroll container, not an overflowing textarea', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<div data-testid="scroll" style="height: 420px; overflow-y: auto; padding-bottom: 20px">
					<div style="height: 300px"></div>
					<textarea data-testid="textarea">${'line\n'.repeat(40)}</textarea>
				</div>
			`);
			const scroll = screen.getByTestId('scroll');
			const textarea = screen.getByTestId('textarea');

			mockScrollSize(scroll, 420, 800);
			// The textarea's own content overflows, making it scrollable itself. Scrolling it cannot
			// move its box above the keyboard, so slack must go to the ancestor.
			mockScrollSize(textarea, 88, 600);
			scroll.getBoundingClientRect = () => box(300, 420);
			textarea.getBoundingClientRect = () => box(650, 40);

			textarea.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(20));
			expect(textarea.style.paddingBottom).toBe('');
		});

		it('sets the keyboard inset CSS variable for a focused input without a scroll target', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<div><input data-testid="input" type="text" /></div>`);
			const popup = screen.getByTestId('popup');
			const input = screen.getByTestId('input');

			input.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(keyboardInset()).toBe('300px'));
			await waitFor(() => expect(getComputedStyle(popup).getPropertyValue('--drawer-keyboard-inset')).toBe('300px'));

			input.blur();

			await waitFor(() => expect(keyboardInset()).toBe('0px'));
		});

		it('captures focusin targets through a shadow root', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<div data-testid="host"></div>`);
			const shadowRoot = screen.getByTestId('host').attachShadow({ mode: 'open' });
			const input = document.createElement('input');
			input.type = 'text';
			shadowRoot.append(input);

			input.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(keyboardInset()).toBe('300px'));
		});

		it('keeps the keyboard inset when focus moves directly to another keyboard input', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<div>
					<input data-testid="input-a" type="text" />
					<input data-testid="input-b" type="text" />
				</div>
			`);
			const inputA = screen.getByTestId('input-a');
			const inputB = screen.getByTestId('input-b');

			inputA.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(keyboardInset()).toBe('300px'));

			// Focus moving straight to another keyboard input must re-align to the new target, not
			// clear the inset. The focusout is dispatched in isolation (no following focusin), so a
			// regression that cleared on every focusout would leave nothing to restore the inset.
			inputA.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: inputB }));

			await waitFor(() => expect(keyboardInset()).toBe('300px'));
		});

		it('does not add keyboard scroll slack by default', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; padding-bottom: 20px'), { provider: false });
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			input.focus();
			scroll.scrollTop = 0;
			visualViewport.resize(500);

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('20px'));
			await waitFor(() => expect(scroll.style.scrollPaddingBottom).toBe(''));
			await waitFor(() => expect(scroll.scrollTop).toBe(0));
		});

		it('restores keyboard scroll slack when the drawer closes', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const { view, drawer } = await renderDrawer(
				scrollBody('height: 420px; overflow-y: auto; overflow-anchor: auto; padding-bottom: 20px'),
			);
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);
			input.getBoundingClientRect = () => box(650, 40);

			input.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(20));
			await waitFor(() => expect(scroll.style.overflowAnchor).toBe('none'));

			drawer.close();
			view.detectChanges();

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('20px'));
			await waitFor(() => expect(scroll.style.scrollPaddingBottom).toBe(''));
			await waitFor(() => expect(scroll.style.overflowAnchor).toBe('auto'));
		});

		it.each([false, true])(
			'releases keyboard inset and scroll slack after focus leaves the field (pointerdown: %s)',
			async (pointerDown) => {
				mockWindowProperty('innerHeight', 800);
				const visualViewport = mockVisualViewport(800);
				await renderDrawer(`
					<div brnDrawerContent data-testid="scroll" style="height: 420px; overflow-y: auto; padding-bottom: 20px">
						<input data-testid="input" type="text" />
						<div style="height: 900px"></div>
						<button data-testid="item" type="button"></button>
					</div>
				`);
				const scroll = screen.getByTestId('scroll');
				const input = screen.getByTestId('input');
				const item = screen.getByTestId('item');

				scroll.getBoundingClientRect = () => box(300, 420);

				input.focus();
				visualViewport.resize(500);

				await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(20));

				// Scroll into the slack, where removing it would clamp the scroll position.
				scroll.scrollTop = scroll.scrollHeight;
				const scrollTop = scroll.scrollTop;
				const paddingBottom = scroll.style.paddingBottom;
				const inset = keyboardInset();

				// A tap's `mousedown` moves focus, and its `mouseup` and `click` are hit-tested at the
				// same point in the same task, so nothing under the finger may move synchronously.
				if (pointerDown) {
					// A consumer can move focus before pointerdown reaches the provider.
					window.addEventListener('pointerdown', () => item.focus(), { capture: true, once: true });
					item.dispatchEvent(
						new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse', button: 0 }),
					);
				} else {
					item.focus();
				}

				expect(scroll.style.paddingBottom).toBe(paddingBottom);
				expect(scroll.scrollTop).toBe(scrollTop);
				expect(keyboardInset()).toBe(inset);

				await flushAnimationFrames(1);

				expect(scroll.style.paddingBottom).toBe('20px');
				expect(keyboardInset()).toBe('0px');
			},
		);

		it('activates an item on the first tap while the keyboard is open', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const onClick = vi.fn();
			await renderDrawer(
				`
				<input data-testid="input" type="text" />
				<button data-testid="item" type="button" style="display: block; width: 200px; height: 40px">
					Select item
				</button>
				`,
				{ popupAttributes: 'style="position: fixed; left: 0; top: calc(360px - var(--drawer-keyboard-inset, 0px))"' },
			);
			const item = screen.getByTestId('item');
			item.addEventListener('click', onClick);

			screen.getByTestId('input').focus();
			visualViewport.resize(500);
			await waitFor(() => expect(keyboardInset()).toBe('300px'));

			const itemRect = item.getBoundingClientRect();
			const x = itemRect.left + itemRect.width / 2;
			const y = itemRect.top + itemRect.height / 2;

			// A tap's compatibility mousedown moves focus, then mouseup and click are hit-tested at the
			// tap point in the same task. A synchronous inset reset on focus loss would move the item
			// away before they land.
			fireEvent.mouseDown(item);
			item.focus();
			const target = document.elementFromPoint(x, y) as Element;
			fireEvent.mouseUp(target);
			fireEvent.click(target);

			expect(onClick).toHaveBeenCalledTimes(1);
			await waitFor(() => expect(keyboardInset()).toBe('0px'));
		});

		it('does not add keyboard scroll slack while pinch-zoomed', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; padding-bottom: 20px'));
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			input.focus();
			scroll.scrollTop = 0;
			visualViewport.setScale(1.5);
			visualViewport.resize(500);

			await waitFor(() => expect(scroll.style.paddingBottom).toBe('20px'));
			await waitFor(() => expect(scroll.style.scrollPaddingBottom).toBe(''));
			await waitFor(() => expect(scroll.scrollTop).toBe(0));
		});
	});

	describe('tap to focus', () => {
		it('focuses an unfocused keyboard input on touchend without page scroll', async () => {
			const { view } = await renderDrawer(
				`<input data-testid="input" type="text" style="opacity: 0.5; transform: scale(1); transition: opacity 1s" />`,
			);
			// Spartan renders no backdrop for a non-modal drawer: the popup carries `data-swiping` too.
			const popup = screen.getByTestId('popup');
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			const clickEvents: MouseEvent[] = [];
			input.addEventListener('click', (clickEvent) => clickEvents.push(clickEvent));
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 12, 34);
			view.detectChanges();

			await waitFor(() => expect(popup).toHaveAttribute('data-swiping', ''));

			const touchEnd = createNativeTouchEnd(input, 12, 34);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
			// Preventing the touchend default suppresses the native compatibility click, so the
			// provider redispatches it.
			expect(clickEvents).toHaveLength(1);
			expect(clickEvents[0].clientX).toBe(12);
			expect(clickEvents[0].clientY).toBe(34);
			expect(clickEvents[0].detail).toBe(1);
			expect(input.style.opacity).toBe('0.5');
			expect(input.style.transform).toBe('scale(1)');
			expect(input.style.transition).toBe('opacity 1s');

			await waitFor(() => {
				view.detectChanges();
				expect(popup).not.toHaveAttribute('data-swiping');
			});
		});

		it('preserves native taps on picker inputs', async () => {
			await renderDrawer(`<input data-testid="input" type="date" />`);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('preserves native taps that lift over a neighboring interactive element', async () => {
			await renderDrawer(`
				<input data-testid="input" type="text" />
				<button data-testid="button" type="button">Action</button>
			`);
			const input = screen.getByTestId('input');
			const button = screen.getByTestId('button');
			const focusSpy = vi.spyOn(input, 'focus');
			const inputClickEvents: Event[] = [];
			input.addEventListener('click', (clickEvent) => inputClickEvents.push(clickEvent));
			// The finger lifts over the button, but `touchend.target` stays on the touchstart input on
			// mobile, so the lift point must win over the fallback.
			mockElementFromPoint(document, () => button);

			touch(input, 'touchstart', 0, 0);
			// The native touchend is still dispatched on the touchstart input.
			const touchEnd = createNativeTouchEnd(input, 5, 5);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
			expect(inputClickEvents).toHaveLength(0);
		});

		it('resolves the lift point through the shadow root when the drawer renders in one', async () => {
			const host = document.body.appendChild(document.createElement('div'));
			overlayShadowRoot = host.attachShadow({ mode: 'open' });
			const shadowRoot = overlayShadowRoot;
			cleanups.push(() => {
				overlayShadowRoot = null;
				host.remove();
			});

			await renderDrawer(
				`
				<input data-testid="input" type="text" />
				<button data-testid="button" type="button">Action</button>
				`,
				{ providers: [{ provide: OverlayContainer, useClass: ShadowRootOverlayContainer }] },
			);
			const input = shadowRoot.querySelector<HTMLInputElement>('[data-testid="input"]');
			const button = shadowRoot.querySelector<HTMLButtonElement>('[data-testid="button"]');
			expect(input).not.toBeNull();
			expect(button).not.toBeNull();
			if (!input || !button) return;

			const focusSpy = vi.spyOn(input, 'focus');
			// A real document hit test retargets shadow content to the host, so only the shadow root
			// sees the button under the lift point. Resolving against the document would miss it and
			// fall back to focusing the touchstart input.
			mockElementFromPoint(document, () => host);
			mockElementFromPoint(shadowRoot, () => button);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 5, 5);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it.each([
			['preserves native taps on disabled inputs', '<input data-testid="input" type="text" disabled />'],
			['preserves native taps on disabled textareas', '<textarea data-testid="input" disabled></textarea>'],
		])('%s', async (_name, field) => {
			await renderDrawer(field);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			const clickEvents: Event[] = [];
			input.addEventListener('click', (clickEvent) => clickEvents.push(clickEvent));
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
			expect(clickEvents).toHaveLength(0);
		});

		it('preserves native taps on a disabled labelled control', async () => {
			await renderDrawer(`
				<label data-testid="label" for="note">Note</label>
				<input data-testid="input" id="note" type="text" disabled />
			`);
			const label = screen.getByTestId('label');
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			const labelClickEvents: Event[] = [];
			label.addEventListener('click', (clickEvent) => labelClickEvents.push(clickEvent));
			mockElementFromPoint(document, () => label);

			touch(label, 'touchstart', 24, 48);
			const touchEnd = createNativeTouchEnd(label, 24, 48);
			label.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
			expect(labelClickEvents).toHaveLength(0);
		});

		it('focuses a keyboard input with data-swipe-ignore without starting drawer swipe', async () => {
			const { view } = await renderDrawer(`<input data-testid="input" data-swipe-ignore type="text" />`);
			const popup = screen.getByTestId('popup');
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			await Promise.resolve();
			view.detectChanges();

			expect(popup).not.toHaveAttribute('data-swiping');

			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();
			view.detectChanges();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
			expect(popup).not.toHaveAttribute('data-swiping');
		});

		it('does not focus a keyboard input on touchend without touchstart', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('does not focus a keyboard input after touchcancel', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			input.dispatchEvent(createNativeTouchCancel(input, 0, 0));
			await Promise.resolve();

			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('does not focus a keyboard input while a nested drawer is open', async () => {
			const { view } = await renderDrawer(`
				<input data-testid="input" type="text" />
				<div brnDrawer state="open" [modal]="false">
					<div *brnDrawerPortal brnDrawerViewport>
						<div brnDrawerPopup><button type="button">Nested action</button></div>
					</div>
				</div>
			`);
			const input = screen.getByTestId('input');
			const parentPopup = screen.getByTestId('popup');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			await waitFor(() => {
				view.detectChanges();
				expect(parentPopup).toHaveAttribute('data-nested-drawer-open', '');
			});

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('preserves native taps on an already-focused keyboard input', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(500);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');

			input.focus();

			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('refocuses an already-focused keyboard input when the keyboard viewport is closed', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(800);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');

			input.focus();

			const focusSpy = vi.spyOn(input, 'focus');
			const blurSpy = vi.spyOn(input, 'blur');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(blurSpy).toHaveBeenCalledTimes(1);
			// iOS 27 only re-presents a natively dismissed keyboard for a refocus of the already-focused
			// input, so the blur/focus transition is followed by one.
			expect(focusSpy).toHaveBeenCalledTimes(2);
			expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
			expect(input).toHaveFocus();
		});

		it('preserves native taps on an already-focused keyboard input on Android when no keyboard is detected', async () => {
			// A keyboard that resizes the layout viewport (`interactive-widget=resizes-content`) shrinks
			// `innerHeight` with the visual viewport, so it is never detected.
			mockAndroid();
			mockWindowProperty('innerHeight', 500);
			mockVisualViewport(500);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');

			input.focus();

			const focusSpy = vi.spyOn(input, 'focus');
			const blurSpy = vi.spyOn(input, 'blur');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(blurSpy).not.toHaveBeenCalled();
			expect(focusSpy).not.toHaveBeenCalled();
			expect(input).toHaveFocus();
		});

		it('refocuses a tapped input after focus moves from another input while the keyboard is closed', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(800);
			await renderDrawer(`
				<input data-testid="first" type="text" />
				<input data-testid="second" type="text" />
			`);
			const first = screen.getByTestId('first');
			const second = screen.getByTestId('second');

			// The keyboard was dismissed natively, leaving the first field focused.
			first.focus();

			const focusSpy = vi.spyOn(second, 'focus');
			const onFocus = vi.fn();
			second.addEventListener('focus', onFocus);
			const focusedDuringCall: boolean[] = [];
			focusSpy.mockImplementation(function focus(this: HTMLElement, options?: FocusOptions) {
				focusedDuringCall.push(document.activeElement === second);
				HTMLElement.prototype.focus.call(this, options);
			});
			mockElementFromPoint(document, () => second);

			touch(second, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(second, 0, 0);
			second.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(focusedDuringCall).toEqual([false, true]);
			expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
			expect(onFocus).toHaveBeenCalledTimes(1);
			expect(second).toHaveFocus();
		});
	});

	describe('focus moves while the keyboard is open', () => {
		it('overrides the incoming field geometry when focus moves without a tap while the keyboard is open', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<input data-testid="first" type="text" />
				<input data-testid="second" type="text" />
			`);
			const first = screen.getByTestId('first');
			const second = screen.getByTestId('second');

			first.focus();
			visualViewport.resize(500);

			// The provider's capture-phase focusout listener runs before this bubble-phase one, so the
			// geometry override must already be applied when it fires.
			let transformDuringFocusChange: string | null = null;
			const onFocusOut = () => (transformDuringFocusChange = second.style.transform);
			document.addEventListener('focusout', onFocusOut);
			cleanups.push(() => document.removeEventListener('focusout', onFocusOut));
			const blurSpy = vi.spyOn(second, 'blur');
			const focusSpy = vi.spyOn(second, 'focus');
			const onFocus = vi.fn();
			second.addEventListener('focus', onFocus);
			let optionsDuringFocusIn: FocusOptions | undefined;
			second.addEventListener('focusin', () => (optionsDuringFocusIn = focusSpy.mock.lastCall?.[0]));

			// Simulates the iOS keyboard's next-field arrow: focus moves with no touch events.
			second.focus();

			expect(transformDuringFocusChange).toContain('translateY');
			expect(second.style.transform).toBe('');
			expect(second.style.opacity).toBe('');
			expect(blurSpy).not.toHaveBeenCalled();
			// The iOS 27 native focus request is recorded between focus and focusin. Protect it during
			// focus without emitting another focus/blur cycle.
			expect(optionsDuringFocusIn).toEqual({ preventScroll: true });
			expect(focusSpy).toHaveBeenCalledTimes(2);
			expect(onFocus).toHaveBeenCalledTimes(1);
			expect(second).toHaveFocus();
		});

		/** Two fields in the scrollable body: `first` sits centered above a 500px keyboard. */
		async function renderTwoFieldBody(scrollBottom: () => number = () => 720) {
			await renderDrawer(`
				<div brnDrawerContent data-testid="scroll" style="height: 420px; overflow-y: auto; padding-bottom: 20px">
					<input data-testid="first" type="text" />
					<div style="height: 900px"></div>
					<input data-testid="second" type="text" />
				</div>
			`);
			const scroll = screen.getByTestId('scroll');
			const first = screen.getByTestId('first');
			const second = screen.getByTestId('second');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => new DOMRect(0, 300, 320, scrollBottom() - 300);
			first.getBoundingClientRect = () => box(380 - scroll.scrollTop, 40);
			second.getBoundingClientRect = () => box(650 - scroll.scrollTop, 40);
			return { scroll, first, second };
		}

		it('centers a field focused without a tap inside the scrollable body', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, first, second } = await renderTwoFieldBody();
			scroll.scrollTo = scrollInstantly(scroll) as typeof scroll.scrollTo;

			const keyboardViewportHeight = 500;
			first.focus();
			scroll.scrollTop = 0;
			visualViewport.resize(keyboardViewportHeight);

			// Simulates the iOS keyboard's next-field arrow: focus moves with no touch events.
			second.focus();

			await waitFor(() => {
				const visibleCenter = (scroll.getBoundingClientRect().top + keyboardViewportHeight) / 2;
				expect(centerOf(second.getBoundingClientRect())).toBeCloseTo(visibleCenter, 0);
			});
		});

		it('does not restart a progressing or settled reduced-motion alignment scroll', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const matchMediaSpy = vi.spyOn(window, 'matchMedia');
			matchMediaSpy.mockImplementation(
				(query: string) => ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList,
			);
			const { scroll, first, second } = await renderTwoFieldBody();
			useFakeTimers();
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			first.focus();
			visualViewport.resize(500);
			scrollToSpy.mockClear();

			second.focus();
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();

			expect(scrollToSpy).toHaveBeenCalledWith({ top: 270, behavior: 'auto' });

			scroll.scrollTop = 100;
			await vi.advanceTimersByTimeAsync(150);
			expect(scrollToSpy).toHaveBeenCalledTimes(1);

			scroll.scrollTop = 270;
			await vi.runAllTimersAsync();

			expect(scroll.scrollTop).toBe(270);
			expect(scrollToSpy).toHaveBeenCalledTimes(1);
		});

		it('re-issues the alignment scroll when a delayed realign pass finds it stalled', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, first, second } = await renderTwoFieldBody();
			// The mock never moves, standing in for a smooth scroll canceled by WebKit's native reveal
			// resolution: a later realign pass must re-issue it.
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			first.focus();
			visualViewport.resize(500);
			scrollToSpy.mockClear();

			second.focus();

			await waitFor(() => expect(scrollToSpy.mock.calls.length).toBeGreaterThanOrEqual(2));
			expect(scrollToSpy).toHaveBeenLastCalledWith(expect.objectContaining({ top: 270 }));
		});

		it('stops pending realignment once the user starts scrolling while geometry is changing', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			let scrollBottom = 380;
			const { scroll, first, second } = await renderTwoFieldBody(() => scrollBottom);
			useFakeTimers();
			// The mock never moves, standing in for a smooth scroll canceled by WebKit's native reveal
			// resolution: the exact stall a delayed pass would re-issue. A user scroll stops at a
			// stationary position the same way, so a pointer going down must cancel the passes rather
			// than let one mistake the manual scroll for a canceled reveal and yank the drawer back.
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			first.focus();
			visualViewport.resize(500);
			scrollToSpy.mockClear();

			second.focus();
			// Let the first settle check observe the squeezed body before the user takes over.
			vi.advanceTimersToNextFrame();
			scroll.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

			// The body continues expanding after pointer-down, then the destination settles. A live
			// frame loop would eventually center the field against the final geometry.
			for (const bottom of [400, 440, 480, 480]) {
				scrollBottom = bottom;
				vi.advanceTimersToNextFrame();
			}
			await vi.runAllTimersAsync();

			// Pointer-down cancels both the pending frame alignment and delayed passes.
			expect(scrollToSpy).not.toHaveBeenCalled();
		});

		it('clears keyboard state when a tapped input redirects focus away', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(500);
			await renderDrawer(`
				<input data-testid="input" type="text" />
				<button data-testid="other" type="button"></button>
			`);
			useFakeTimers();
			const input = screen.getByTestId('input');
			const other = screen.getByTestId('other');

			// A consumer redirects focus off the field the moment it focuses (validation, auto-advance,
			// composite focus). The listener runs after the provider's capture-phase `focusin` has
			// recorded the input, so the provider must reconcile when focus lands elsewhere.
			input.addEventListener('focusin', () => other.focus());
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 12, 34);
			input.dispatchEvent(createNativeTouchEnd(input, 12, 34));
			await vi.runAllTimersAsync();

			// Focus stays on the redirected element and the drawer left no inset for the abandoned input.
			expect(other).toHaveFocus();
			expect(keyboardInset()).toBe('0px');
		});

		it('clears keyboard state when a tapped input blurs itself', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(500);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; overflow-anchor: auto; padding-bottom: 20px'));
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);
			input.getBoundingClientRect = () => box(650, 40);

			// A consumer that opens its own picker instead of the software keyboard blurs the field on
			// focus. The `focusout` arrives before `.focus()` returns and focus ends on the body, so no
			// `focusin` follows to reconcile from: that `focusout` is the provider's only chance to drop
			// the field.
			input.addEventListener('focusin', () => input.blur());
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 12, 34);
			input.dispatchEvent(createNativeTouchEnd(input, 12, 34));
			// Let the frame-scheduled alignment run: it is what applies the inset and slack to a target
			// the `focusout` failed to clear.
			await flushAnimationFrames(3);

			expect(input).not.toHaveFocus();
			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('20px');
			expect(scroll.style.scrollPaddingBottom).toBe('');
		});

		it('defers the alignment scroll until the destination stops moving', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto'));
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			// The scroller's bottom edge moves after focus (like a footer resizing over a CSS
			// transition): squeezed at first, settled a frame later.
			let scrollBottom = 380;
			scroll.getBoundingClientRect = () => new DOMRect(0, 300, 320, scrollBottom - 300);
			input.getBoundingClientRect = () => box(650 - scroll.scrollTop, 40);
			const scrollToSpy = vi.fn(scrollInstantly(scroll));
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			visualViewport.resize(500);
			input.focus();

			// Let the first alignment check measure the squeezed geometry, then settle it.
			vi.advanceTimersToNextFrame();
			scrollBottom = 480;
			await vi.runAllTimersAsync();

			// Squeezed destination: visible band [316, 364] -> center 340, input center 670 -> scrollTop
			// 330. Settled: band [316, 464] -> center 390 -> scrollTop 280. The squeezed destination
			// must never be scrolled to.
			expect(scroll.scrollTop).toBe(280);
			expect(scrollToSpy).toHaveBeenCalledTimes(1);
			expect(scrollToSpy).not.toHaveBeenCalledWith(expect.objectContaining({ top: 330 }));
		});

		it('eventually aligns when geometry never settles', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(500);
			await renderDrawer(
				`<div data-testid="scroll" style="height: 420px; overflow-y: auto"><input data-testid="input" type="text" /></div>`,
				{ autoFocus: 'false' },
			);
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');
			let geometryTick = 0;
			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => {
				geometryTick += 1;
				return box(geometryTick % 2 === 0 ? 100 : 200, 300);
			};
			input.getBoundingClientRect = () => box(650, 40);
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			input.focus();
			for (let index = 0; index < 65; index += 1) {
				vi.advanceTimersToNextFrame();
			}

			expect(scrollToSpy).toHaveBeenCalledTimes(1);
		});

		it('realigns a tapped field in the scrollable body when the keyboard is already open for a field outside it', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<div brnDrawerContent data-testid="scroll" style="height: 420px; overflow-y: auto">
					<div style="height: 900px"></div>
					<textarea data-testid="textarea"></textarea>
				</div>
				<div><input data-testid="footer-input" type="text" /></div>
			`);
			const scroll = screen.getByTestId('scroll');
			const textarea = screen.getByTestId('textarea');
			const footerInput = screen.getByTestId('footer-input');

			mockScrollSize(scroll, 420, 1200);
			// The scroller is squeezed while the footer field holds focus (the demo footer grows by the
			// keyboard inset via `:focus-within`); it expands back once focus moves into the body.
			let scrollBottom = 380;
			scroll.getBoundingClientRect = () => new DOMRect(0, 100, 320, scrollBottom - 100);
			textarea.getBoundingClientRect = () => box(650 - scroll.scrollTop, 40);
			scroll.scrollTo = scrollInstantly(scroll) as typeof scroll.scrollTo;

			const keyboardViewportHeight = 500;
			footerInput.focus();
			visualViewport.resize(keyboardViewportHeight);

			mockElementFromPoint(document, () => textarea);
			touch(textarea, 'touchstart', 24, 300);
			textarea.dispatchEvent(createNativeTouchEnd(textarea, 24, 300));
			await Promise.resolve();

			expect(textarea).toHaveFocus();

			// The frame-scheduled pass centers against the squeezed geometry: visible band [116, 364]
			// -> center 240, textarea center 670 -> scrollTop 430.
			await waitFor(() => expect(scroll.scrollTop).toBe(430));

			// The footer's shrink transition settles; only the delayed realign passes see the expanded
			// scroller (the keyboard stays open, so no viewport events fire).
			scrollBottom = 480;

			await waitFor(() => {
				const scrollRect = scroll.getBoundingClientRect();
				const visibleCenter = (scrollRect.top + Math.min(scrollRect.bottom, keyboardViewportHeight)) / 2;
				expect(centerOf(textarea.getBoundingClientRect())).toBeCloseTo(visibleCenter, 0);
			});
		});

		it('does not blur and re-focus for focus changes while the keyboard is closed', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(800);
			await renderDrawer(`
				<input data-testid="first" type="text" />
				<input data-testid="second" type="text" />
			`);
			const first = screen.getByTestId('first');
			const second = screen.getByTestId('second');

			first.focus();

			const blurSpy = vi.spyOn(second, 'blur');
			const focusSpy = vi.spyOn(second, 'focus');

			second.focus();

			expect(blurSpy).not.toHaveBeenCalled();
			expect(focusSpy).toHaveBeenCalledTimes(1);
			expect(second).toHaveFocus();
		});
	});

	describe('page scroll and keyboard detection', () => {
		it('restores the page scroll position when a modal drawer page scrolls while the keyboard is open', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<input data-testid="input" type="text" />`, { modal: true });
			const input = screen.getByTestId('input');

			input.focus();
			visualViewport.resize(500);

			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			// Simulates WebKit's native reveal scroll escaping the scroll lock.
			mockWindowProperty('scrollY', 120);
			window.dispatchEvent(new Event('scroll'));

			// Must restore instantly so the following measurements read the resting page; the
			// two-argument form would obey a global `scroll-behavior: smooth` and animate.
			expect(scrollToSpy).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'instant' });
		});

		it('does not restore the page scroll position for a non-modal drawer', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');

			input.focus();
			visualViewport.resize(500);

			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			mockWindowProperty('scrollY', 120);
			window.dispatchEvent(new Event('scroll'));

			expect(scrollToSpy).not.toHaveBeenCalled();
		});

		it('does not treat a small visual viewport reduction as the software keyboard', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(scrollBody('height: 420px; overflow-y: auto; padding-bottom: 20px'));
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);

			// A reduction of 50px is below KEYBOARD_RESIZE_THRESHOLD (60px), so it is treated as browser
			// chrome movement rather than the software keyboard: no inset, no scroll slack.
			input.focus();
			visualViewport.resize(750);

			await waitFor(() => expect(keyboardInset()).toBe('0px'));
			expect(scroll.style.paddingBottom).toBe('20px');
			expect(scroll.style.overflowAnchor).toBe('');
		});

		it('computes the keyboard inset from a non-zero visual viewport offset', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');

			input.focus();
			// The visual viewport shrinks to 500 and is offset 40px down within the layout viewport.
			visualViewport.scroll(40, 500);

			// inset = innerHeight - min(innerHeight, offsetTop + height) = 800 - (40 + 500) = 260.
			await waitFor(() => expect(keyboardInset()).toBe('260px'));
		});
	});

	describe('labels and editable content', () => {
		it.each(['explicit', 'implicit'])(
			'preserves preventScroll after activating an %s label with no input focused',
			async (association) => {
				const field = '<input data-testid="input" id="note" type="text" />';
				await renderDrawer(
					`
					<label data-testid="label" ${association === 'explicit' ? 'for="note"' : ''}>
						<span data-testid="label-text">Note</span>
						${association === 'implicit' ? field : ''}
					</label>
					${association === 'explicit' ? field : ''}
					`,
					{ autoFocus: 'false' },
				);
				const label = screen.getByTestId('label');
				const input = screen.getByTestId('input');
				const labelText = screen.getByTestId('label-text');
				expect(input).not.toHaveFocus();
				const focusSpy = vi.spyOn(input, 'focus');
				const onFocus = vi.fn();
				const onBlur = vi.fn();
				input.addEventListener('focus', onFocus);
				input.addEventListener('blur', onBlur);
				const inputClickEvents: Event[] = [];
				let focusCallsDuringActivation = 0;
				input.addEventListener('click', (clickEvent) => {
					inputClickEvents.push(clickEvent);
					focusCallsDuringActivation = focusSpy.mock.calls.length;
				});
				const labelClickEvents: MouseEvent[] = [];
				label.addEventListener('click', (clickEvent) => {
					if (clickEvent.target === labelText) labelClickEvents.push(clickEvent);
				});
				mockElementFromPoint(document, () => labelText);

				touch(labelText, 'touchstart', 24, 48);
				const touchEnd = createNativeTouchEnd(labelText, 24, 48);
				labelText.dispatchEvent(touchEnd);
				await Promise.resolve();

				expect(touchEnd.defaultPrevented).toBe(true);
				expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
				expect(labelClickEvents).toHaveLength(1);
				expect(labelClickEvents[0].clientX).toBe(24);
				expect(labelClickEvents[0].clientY).toBe(48);
				expect(labelClickEvents[0].detail).toBe(1);
				expect(labelClickEvents[0].defaultPrevented).toBe(false);
				expect(inputClickEvents).toHaveLength(1);
				// WebKit's label default action refocuses without preventScroll after forwarding the click.
				// Reapply it after activation without emitting a new focus/blur cycle.
				expect(focusCallsDuringActivation).toBe(1);
				expect(focusSpy).toHaveBeenCalledTimes(2);
				expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
				expect(onFocus).toHaveBeenCalledTimes(1);
				expect(onBlur).not.toHaveBeenCalled();
				expect(input).toHaveFocus();
			},
		);

		it('preserves a focus change from a label click handler', async () => {
			await renderDrawer(
				`
				<label data-testid="label" for="note">Note</label>
				<input data-testid="input" id="note" />
				<button data-testid="other" type="button">Other</button>
				`,
				{ autoFocus: 'false' },
			);
			const label = screen.getByTestId('label');
			const input = screen.getByTestId('input');
			const other = screen.getByTestId('other');
			label.addEventListener('click', (event) => {
				event.preventDefault();
				other.focus();
			});
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => label);

			touch(label, 'touchstart', 24, 48);
			label.dispatchEvent(createNativeTouchEnd(label, 24, 48));
			await Promise.resolve();

			expect(other).toHaveFocus();
			expect(focusSpy).toHaveBeenCalledTimes(1);
		});

		it('focuses a contentEditable element on touchend', async () => {
			await renderDrawer(`<div data-testid="editor" contenteditable="true">Edit me</div>`);
			const editor = screen.getByTestId('editor');
			const focusSpy = vi.spyOn(editor, 'focus');
			mockElementFromPoint(document, () => editor);

			touch(editor, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(editor, 0, 0);
			editor.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
		});

		it('focuses the editing host when tapping a nested element inside a contentEditable', async () => {
			await renderDrawer(`
				<div data-testid="editor" contenteditable="true"><span data-testid="inner">Edit me</span></div>
			`);
			const editor = screen.getByTestId('editor');
			const inner = screen.getByTestId('inner');
			// Taps on rich-text content land on inherited-editable descendants, which are not focusable
			// themselves; the editing host must receive focus instead.
			mockElementFromPoint(document, () => inner);

			touch(inner, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(inner, 0, 0);
			inner.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(editor).toHaveFocus();
		});
	});

	describe('tap resolution', () => {
		it('probes nearby points to resolve a keyboard input retargeted on touchend', async () => {
			await renderDrawer(`
				<div data-testid="wrapper" style="padding: 20px"><input data-testid="input" type="text" /></div>
			`);
			const wrapper = screen.getByTestId('wrapper');
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			// The tap point resolves to the wrapper; only a point 16px below resolves to the input, so
			// the input can only be found via the hit-slop probe (not the native event target).
			mockElementFromPoint(document, (_x, y) => (y === 16 ? input : wrapper));

			touch(wrapper, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(wrapper, 0, 0);
			wrapper.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
		});

		it('does not focus a keyboard input when the touch moves past the tap threshold', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			touch(input, 'touchstart', 0, 0);
			// Moving past INPUT_TAP_MOVE_THRESHOLD (10px) marks the gesture as a scroll, not a tap.
			touch(input, 'touchmove', 0, 80);
			const touchEnd = createNativeTouchEnd(input, 0, 80);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();

			touch(input, 'touchstart', 0, 0);
			touch(input, 'touchmove', 0, 5);
			const shortMoveTouchEnd = createNativeTouchEnd(input, 0, 5);
			input.dispatchEvent(shortMoveTouchEnd);
			await Promise.resolve();

			expect(shortMoveTouchEnd.defaultPrevented).toBe(true);
			expect(input).toHaveFocus();
		});

		it('restores the previous scroll slack when focus moves to a different scroll container', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`
				<div data-testid="scroll1" style="height: 200px; overflow-y: auto; padding-bottom: 10px">
					<div style="height: 600px"></div>
					<input data-testid="input1" type="text" />
				</div>
				<div data-testid="scroll2" style="height: 200px; overflow-y: auto; padding-bottom: 10px">
					<div style="height: 600px"></div>
					<input data-testid="input2" type="text" />
				</div>
			`);
			const scroll1 = screen.getByTestId('scroll1');
			const scroll2 = screen.getByTestId('scroll2');
			const input1 = screen.getByTestId('input1');
			const input2 = screen.getByTestId('input2');

			mockScrollSize(scroll1, 200, 800);
			mockScrollSize(scroll2, 200, 800);
			// Both containers extend below the reduced viewport bottom (500), so each needs slack.
			scroll1.getBoundingClientRect = () => box(520, 40);
			scroll2.getBoundingClientRect = () => box(560, 40);
			input1.getBoundingClientRect = () => box(540, 40);
			input2.getBoundingClientRect = () => box(580, 40);

			input1.focus();
			visualViewport.resize(500);

			await waitFor(() => expect(Number.parseFloat(scroll1.style.paddingBottom)).toBeGreaterThan(10));

			input2.focus();

			await waitFor(() => expect(Number.parseFloat(scroll2.style.paddingBottom)).toBeGreaterThan(10));
			expect(scroll1.style.paddingBottom).toBe('10px');
			expect(scroll1.style.overflowAnchor).toBe('');
		});

		it('does not steal a tap that lands on an interactive element near a keyboard input', async () => {
			await renderDrawer(`
				<input data-testid="input" type="text" />
				<button data-testid="clear" type="button">Clear</button>
			`);
			const input = screen.getByTestId('input');
			const clear = screen.getByTestId('clear');
			const focusSpy = vi.spyOn(input, 'focus');
			// The tap lands exactly on the button; only the hit-slop probe points resolve to the input.
			// The probe must not steal the button's tap.
			mockElementFromPoint(document, (x, y) => (x === 0 && y === 0 ? clear : input));

			touch(clear, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(clear, 0, 0);
			clear.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('preserves native taps on keyboard inputs while pinch-zoomed', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			await renderDrawer(`<input data-testid="input" type="text" />`);
			const input = screen.getByTestId('input');
			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			visualViewport.setScale(1.5);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('restores slack from a removed scroll container before adjusting a new one', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(500);
			await renderDrawer(
				`
				<div data-testid="scroll1" style="overflow-y: auto; padding-bottom: 10px">
					<input data-testid="input1" type="text" />
				</div>
				<div data-testid="scroll2" style="overflow-y: auto">
					<input data-testid="input2" type="text" />
				</div>
				`,
				{ autoFocus: 'false' },
			);
			const scroll1 = screen.getByTestId('scroll1');
			const scroll2 = screen.getByTestId('scroll2');
			const input1 = screen.getByTestId('input1');
			const input2 = screen.getByTestId('input2');

			for (const scroll of [scroll1, scroll2]) {
				mockScrollSize(scroll, 200, 800);
				scroll.getBoundingClientRect = () => box(300, 400);
			}
			input1.getBoundingClientRect = () => box(620, 40);
			input2.getBoundingClientRect = () => box(620, 40);

			input1.focus();
			visualViewport.resize(500);
			await waitFor(() => expect(Number.parseFloat(scroll1.style.paddingBottom)).toBeGreaterThan(10));

			Object.defineProperty(scroll1, 'isConnected', { configurable: true, value: false });
			input2.focus();

			await waitFor(() => expect(Number.parseFloat(scroll2.style.paddingBottom)).toBeGreaterThan(0));
			expect(scroll1.style.paddingBottom).toBe('10px');
			expect(scroll1.style.overflowAnchor).toBe('');
		});

		it('clears inset and slack when the focused field is removed', async () => {
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(500);
			await renderDrawer(
				`
				<div data-testid="scroll" style="overflow-y: auto; padding-bottom: 10px">
					<input data-testid="input" type="text" />
				</div>
				`,
				{ autoFocus: 'false' },
			);
			const viewport = getViewport();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');
			mockScrollSize(scroll, 200, 800);
			scroll.getBoundingClientRect = () => box(300, 400);
			input.getBoundingClientRect = () => box(620, 40);

			input.focus();
			visualViewport.resize(500);
			await waitFor(() => expect(Number.parseFloat(scroll.style.paddingBottom)).toBeGreaterThan(10));

			const nativeContains = viewport.contains.bind(viewport);
			viewport.contains = (candidate) => (candidate === input ? false : nativeContains(candidate));
			visualViewport.resize(490);
			await flushAnimationFrames(2);

			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('10px');
		});

		it('captures an initially focused input without attempting an unnecessary page restore', async () => {
			mockWindowProperty('innerHeight', 800);
			mockVisualViewport(500);
			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			// Spartan focuses the input through the drawer's `autoFocus`, like React's `autoFocus`.
			await renderDrawer(`<input data-testid="input" id="autofocus-input" type="text" />`, {
				modal: true,
				autoFocus: `'#autofocus-input'`,
			});

			expect(screen.getByTestId('input')).toHaveFocus();
			await waitFor(() => expect(keyboardInset()).toBe('300px'));
			expect(scrollToSpy).not.toHaveBeenCalled();
		});

		it('ignores a directly captured touch target while a closed drawer remains mounted', async () => {
			const { view, drawer } = await renderDrawer(
				`<brn-drawer-direct-keyboard-touch-target></brn-drawer-direct-keyboard-touch-target>`,
				{ autoFocus: 'false' },
			);
			const popup = screen.getByTestId('popup');
			const input = screen.getByTestId('input');
			mockElementFromPoint(document, () => input);

			// The touch arrives while the exit transition keeps the closed drawer mounted.
			drawer.close();
			view.detectChanges();
			expect(popup).toHaveAttribute('data-closed', '');
			expect(input.isConnected).toBe(true);

			touch(input, 'touchstart', 0, 0);
			input.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, touches: [] }));
			input.dispatchEvent(createNativeTouchEnd(input, 0, 0));

			expect(input).not.toHaveFocus();
		});

		it('does not focus a lift-point target outside the drawer', async () => {
			await renderDrawer(`<input data-testid="inside" type="text" />`, {
				autoFocus: 'false',
				before: '<input data-testid="outside" type="text" />',
			});
			const inside = screen.getByTestId('inside');
			const outside = screen.getByTestId('outside');
			mockElementFromPoint(document, () => outside);

			touch(inside, 'touchstart', 0, 0);
			inside.dispatchEvent(createNativeTouchEnd(inside, 0, 0));

			expect(inside).not.toHaveFocus();
			expect(outside).not.toHaveFocus();
		});

		it('falls back to the touch target when point lookup misses', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`, { autoFocus: 'false' });
			const input = screen.getByTestId('input');
			mockElementFromPoint(document, () => null);

			touch(input, 'touchstart', 0, 0);
			const touchEnd = createNativeTouchEnd(input, 0, 0);
			input.dispatchEvent(touchEnd);

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(input).toHaveFocus();
		});

		it('uses the remaining touch and MouseEvent fallback for keyboard taps', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`, { autoFocus: 'false' });
			const input = screen.getByTestId('input');
			mockElementFromPoint(document, () => null);

			touch(input, 'touchstart', 10, 20);
			mockWindowProperty('PointerEvent', undefined);
			const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
			Object.defineProperties(touchEnd, {
				changedTouches: { configurable: true, value: [] },
				touches: {
					configurable: true,
					value: [new Touch({ identifier: 1, target: input, clientX: 10, clientY: 20 })],
				},
			});
			input.dispatchEvent(touchEnd);

			expect(touchEnd.defaultPrevented).toBe(true);
			expect(input).toHaveFocus();
		});

		it('ignores a keyboard tap whose native target is not an element', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`, { autoFocus: 'false' });
			const input = screen.getByTestId('input');
			mockElementFromPoint(document, () => null);

			touch(input, 'touchstart', 10, 20);
			const touchEnd = createNativeTouchEnd(input, 10, 20);
			touchEnd.composedPath = () => [window];
			input.dispatchEvent(touchEnd);

			expect(touchEnd.defaultPrevented).toBe(false);
			expect(input).not.toHaveFocus();
		});

		it('ignores touchend without a lift coordinate', async () => {
			await renderDrawer(`<input data-testid="input" type="text" />`, { autoFocus: 'false' });
			const input = screen.getByTestId('input');

			touch(input, 'touchstart', 10, 20);
			const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
			Object.defineProperties(touchEnd, {
				changedTouches: { configurable: true, value: [] },
				touches: { configurable: true, value: [] },
			});
			input.dispatchEvent(touchEnd);
			await Promise.resolve();

			expect(input).not.toHaveFocus();
		});

		it('does not align inputs when visualViewport is unavailable', async () => {
			mockWindowProperty('visualViewport', undefined);
			await renderDrawer(`<input data-testid="input" type="text" />`, { autoFocus: 'false' });

			screen.getByTestId('input').focus();
			await flushAnimationFrames(2);

			expect(keyboardInset()).toBe('0px');
		});
	});

	describe('layout viewport resized for the keyboard (Chrome on iOS)', () => {
		function renderKeyboardDrawer() {
			return renderDrawer(scrollBody('height: 420px; overflow-y: auto; padding-bottom: 20px'));
		}

		// New Chrome on iOS shrinks `svh` for the keyboard before resizing the layout viewport.
		function mockSmallViewportHeight(initialHeight: number) {
			const originalDescriptor = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'offsetHeight',
			) as PropertyDescriptor;
			let smallViewportHeight = initialHeight;
			Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
				configurable: true,
				get(this: HTMLElement) {
					return this.style.height === '100svh' ? smallViewportHeight : originalDescriptor.get?.call(this);
				},
			});
			cleanups.push(() => Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalDescriptor));
			return {
				set(nextHeight: number) {
					smallViewportHeight = nextHeight;
				},
			};
		}

		function mockScrollGeometry(scroll: HTMLElement, input: HTMLElement) {
			mockScrollSize(scroll, 380, 1200);
			// The shrunken viewport keeps the scroller above the keyboard.
			scroll.getBoundingClientRect = () => new DOMRect(0, 100, 320, 380);
			input.getBoundingClientRect = () => new DOMRect(0, 650 - scroll.scrollTop, 320, 40);
		}

		it('applies no keyboard inset or slack when the small viewport follows the keyboard', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const smallViewport = mockSmallViewportHeight(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			// The scroller lays out inside the layout viewport; against the full-height one, the
			// keyboard would overlap its bottom 220px.
			scroll.getBoundingClientRect = () => new DOMRect(0, window.innerHeight - 500, 320, 420);

			input.focus();
			smallViewport.set(500);
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('20px');

			innerHeight.resize(650);
			vi.advanceTimersToNextFrame();
			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('20px');
		});

		it('aligns the focused field once the layout viewport has shrunk to the visual viewport', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollGeometry(scroll, input);
			scroll.scrollTo = scrollInstantly(scroll) as typeof scroll.scrollTo;

			// The visual viewport shrinks first; the layout viewport follows a frame later.
			input.focus();
			scroll.scrollTop = 0;
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			innerHeight.resize(500);
			await vi.advanceTimersByTimeAsync(200);

			expect(centerOf(input.getBoundingClientRect())).toBeCloseTo((100 + 480) / 2, 0);
			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('20px');
		});

		it('scrolls the focused field once the layout viewport reaches the visual viewport', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const smallViewport = mockSmallViewportHeight(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollGeometry(scroll, input);
			const scrollToSpy = vi.spyOn(scroll, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			input.focus();
			smallViewport.set(500);
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			// The layout viewport can pause on its way down.
			innerHeight.resize(700);
			vi.advanceTimersToNextFrame();
			innerHeight.resize(600);
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			expect(scrollToSpy).not.toHaveBeenCalled();

			innerHeight.resize(500);
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			expect(scrollToSpy).toHaveBeenCalledTimes(1);
		});

		it('waits for the layout viewport to grow to a shorter keyboard before scrolling', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const smallViewport = mockSmallViewportHeight(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollGeometry(scroll, input);
			const scrollToSpy = vi.spyOn(scroll, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			input.focus();
			smallViewport.set(500);
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			innerHeight.resize(500);
			await vi.advanceTimersByTimeAsync(2000);
			expect(scrollToSpy).toHaveBeenCalledTimes(1);
			scrollToSpy.mockClear();

			// The keyboard gets shorter while staying open; the layout viewport follows later.
			smallViewport.set(540);
			visualViewport.resize(540);
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			expect(scrollToSpy).not.toHaveBeenCalled();

			innerHeight.resize(540);
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			expect(scrollToSpy).toHaveBeenCalledTimes(1);
		});

		it('does not treat a plain resize of both viewports as the software keyboard', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollGeometry(scroll, input);
			const scrollToSpy = vi.spyOn(scroll, 'scrollTo');
			scrollToSpy.mockImplementation(() => undefined);

			input.focus();
			await vi.advanceTimersByTimeAsync(100);

			// A window resize (or rotation) moves both viewports together.
			visualViewport.resize(500);
			innerHeight.resize(500);
			await vi.advanceTimersByTimeAsync(200);

			expect(scrollToSpy).not.toHaveBeenCalled();
			expect(['', '0px']).toContain(keyboardInset());
			expect(scroll.style.paddingBottom).toBe('20px');
		});

		it('clears the keyboard inset and slack once the layout viewport catches up with the visual viewport', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			// Place the scroller so the keyboard overlaps its bottom 220px.
			let scrollBottom = 720;
			scroll.getBoundingClientRect = () => new DOMRect(0, scrollBottom - 420, 320, 420);

			// Let the alignment passes finish so only the resize can re-measure.
			input.focus();
			visualViewport.resize(500);
			await vi.advanceTimersByTimeAsync(2000);
			expect(keyboardInset()).toBe('300px');
			expect(scroll.style.paddingBottom).toBe('240px');

			// The layout viewport catches up and the fixed drawer lays out inside it.
			scrollBottom = 480;
			innerHeight.resize(500);
			vi.advanceTimersToNextFrame();
			expect(keyboardInset()).toBe('0px');
			expect(scroll.style.paddingBottom).toBe('20px');
		});

		it('preserves native taps while the keyboard is open and refocuses once it closes', async () => {
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			await renderKeyboardDrawer();
			useFakeTimers();
			const input = screen.getByTestId('input');

			const tap = () => {
				touch(input, 'touchstart', 0, 0);
				const touchEnd = createNativeTouchEnd(input, 0, 0);
				input.dispatchEvent(touchEnd);
				return touchEnd;
			};

			input.focus();
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			innerHeight.resize(500);
			await vi.advanceTimersByTimeAsync(200);

			const focusSpy = vi.spyOn(input, 'focus');
			mockElementFromPoint(document, () => input);

			// The overlap is gone, but the keyboard is still open.
			expect(tap().defaultPrevented).toBe(false);
			expect(focusSpy).not.toHaveBeenCalled();

			visualViewport.resize(800);
			innerHeight.resize(800);
			await vi.advanceTimersByTimeAsync(200);

			expect(tap().defaultPrevented).toBe(true);
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
		});
	});

	describe('alignment on Android', () => {
		// Visible band above a 500px keyboard: [300, 500].
		async function renderAlignmentDrawer(inputTop: number, textareaHeight?: number) {
			const inputHeight = textareaHeight ?? 40;
			await renderDrawer(
				scrollBody(
					'height: 420px; overflow-y: auto',
					textareaHeight === undefined
						? '<input data-testid="input" type="text" />'
						: '<textarea data-testid="input"></textarea>',
				),
			);
			const scroll = screen.getByTestId('scroll');
			const input = screen.getByTestId('input');

			mockScrollSize(scroll, 420, 1200);
			scroll.getBoundingClientRect = () => box(300, 420);
			input.getBoundingClientRect = () => box(inputTop - scroll.scrollTop, inputHeight);
			return { scroll, input };
		}

		const scrolledTops = (spy: ReturnType<typeof vi.fn>) =>
			spy.mock.calls.map(([options]) => (options as ScrollToOptions).top);

		it.each([
			{ name: 'leaves a visible field in place on Android', android: true, expected: [] },
			{ name: 'centers a visible field elsewhere', android: false, expected: [50] },
			{
				name: 'reveals a covered field by the minimum distance on Android',
				android: true,
				inputTop: 650,
				expected: [206],
			},
			{ name: 'centers a covered field elsewhere', android: false, inputTop: 650, expected: [270] },
			{
				name: 'leaves a tall textarea that fits the visible band in place on Android',
				android: true,
				inputTop: 320,
				textareaHeight: 175,
				expected: [],
			},
			{
				name: 'reveals a covered tall textarea without hiding its bottom on Android',
				android: true,
				inputTop: 350,
				textareaHeight: 190,
				expected: [45],
			},
			{
				name: 'aligns the top of a textarea taller than the visible band on Android',
				android: true,
				inputTop: 350,
				textareaHeight: 300,
				expected: [50],
			},
		])('$name', async ({ android, inputTop = 430, textareaHeight, expected }) => {
			if (android) mockAndroid();
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, input } = await renderAlignmentDrawer(inputTop, textareaHeight);
			const scrollToSpy = vi.fn(scrollInstantly(scroll));
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;
			expect(scroll.scrollTop).toBe(0);

			input.focus({ preventScroll: true });
			visualViewport.resize(500);
			await flushAnimationFrames(10);

			expect(scrolledTops(scrollToSpy)).toEqual(expected);
		});

		it('re-issues a canceled alignment scroll within a few frames', async () => {
			mockAndroid();
			mockWindowProperty('innerHeight', 800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, input } = await renderAlignmentDrawer(650);
			useFakeTimers();
			// The mock never moves, standing in for a smooth scroll canceled by Chrome's
			// focused-editable reveal.
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;
			expect(scroll.scrollTop).toBe(0);

			input.focus({ preventScroll: true });
			visualViewport.resize(500);
			vi.advanceTimersToNextFrame();
			vi.advanceTimersToNextFrame();
			expect(scrollToSpy).toHaveBeenCalledTimes(1);

			for (let i = 0; i < 4; i += 1) {
				vi.advanceTimersToNextFrame();
			}
			expect(scrollToSpy).toHaveBeenCalledTimes(2);
			expect(scrollToSpy).toHaveBeenLastCalledWith(expect.objectContaining({ top: 206 }));
		});

		it.each([
			{
				name: 'reveals a covered field when the keyboard shrinks the layout viewport on Android',
				android: true,
				expected: [206],
			},
			{ name: 'does not treat a shrinking layout viewport as the keyboard elsewhere', android: false, expected: [] },
		])('$name', async ({ android, expected }) => {
			if (android) mockAndroid();
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, input } = await renderAlignmentDrawer(650);
			const scrollToSpy = vi.fn(scrollInstantly(scroll));
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;
			expect(scroll.scrollTop).toBe(0);

			input.focus({ preventScroll: true });
			// `interactive-widget=resizes-content`: both viewports shrink together.
			innerHeight.resize(500);
			visualViewport.resize(500);
			await flushAnimationFrames(10);

			expect(scrolledTops(scrollToSpy)).toEqual(expected);
		});

		it.each([
			{ name: 'adds no scroll slack for a sub-pixel overlap', bottom: 500.4, expected: '' },
			{ name: 'adds scroll slack for an overlap above a pixel', bottom: 502, expected: '18px' },
		])('$name', async ({ bottom, expected }) => {
			mockAndroid();
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, input } = await renderAlignmentDrawer(430);
			scroll.getBoundingClientRect = () => box(bottom - 420, 420);
			expect(scroll.style.paddingBottom).toBe('');

			input.focus({ preventScroll: true });
			innerHeight.resize(500);
			visualViewport.resize(500);
			await flushAnimationFrames(10);

			expect(scroll.style.paddingBottom).toBe(expected);
		});

		it('does not treat a rotation as the keyboard on Android', async () => {
			mockAndroid();
			const innerHeight = mockResizableInnerHeight(800);
			const visualViewport = mockVisualViewport(800);
			const { scroll, input } = await renderAlignmentDrawer(650);
			const scrollToSpy = vi.fn();
			scroll.scrollTo = scrollToSpy as unknown as typeof scroll.scrollTo;

			input.focus({ preventScroll: true });
			mockWindowProperty('innerWidth', window.innerWidth + 400);
			innerHeight.resize(500);
			visualViewport.resize(500);
			await flushAnimationFrames(10);

			expect(scrollToSpy).not.toHaveBeenCalled();
		});
	});
});
