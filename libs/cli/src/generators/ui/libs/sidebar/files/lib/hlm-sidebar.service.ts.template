import { isPlatformServer } from '@angular/common';
import {
	afterNextRender,
	computed,
	DestroyRef,
	DOCUMENT,
	inject,
	Injectable,
	PLATFORM_ID,
	REQUEST,
	type Signal,
	signal,
} from '@angular/core';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

export type SidebarVariant = 'sidebar' | 'floating' | 'inset';

@Injectable({ providedIn: 'root' })
export class HlmSidebarService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _request = inject(REQUEST, { optional: true });
	private readonly _config = injectHlmSidebarConfig();
	private readonly _document = inject(DOCUMENT);
	private readonly _window = this._document.defaultView;
	private readonly _open = signal<boolean>(this._config.defaultOpen);
	private readonly _openMobile = signal<boolean>(false);
	private readonly _isMobile = signal<boolean>(false);
	private readonly _variant = signal<SidebarVariant>('sidebar');
	private _mediaQuery: MediaQueryList | null = null;

	public readonly open: Signal<boolean> = this._open.asReadonly();
	public readonly openMobile: Signal<boolean> = this._openMobile.asReadonly();
	public readonly isMobile: Signal<boolean> = this._isMobile.asReadonly();
	public readonly variant: Signal<SidebarVariant> = this._variant.asReadonly();

	public readonly state = computed<'expanded' | 'collapsed'>(() => (this._open() ? 'expanded' : 'collapsed'));

	constructor() {
		const destroyRef = inject(DestroyRef);
		this.restoreStateFromCookie();

		afterNextRender(() => {
			if (!this._window || typeof this._window.matchMedia !== 'function') return;

			// Initialize MediaQueryList
			this._mediaQuery = this._window.matchMedia(`(max-width: ${this._config.mobileBreakpoint})`);
			this._isMobile.set(this._mediaQuery.matches);

			// Add media query listener
			const mediaQueryHandler = (e: MediaQueryListEvent) => {
				this._isMobile.set(e.matches);
				// If switching from mobile to desktop, close mobile sidebar
				if (!e.matches) this._openMobile.set(false);
			};
			this._mediaQuery.addEventListener('change', mediaQueryHandler);

			// Add keyboard shortcut listener
			const keydownHandler = (event: KeyboardEvent) => {
				if (
					event.key === this._config.sidebarKeyboardShortcut &&
					(event.ctrlKey || event.metaKey) &&
					!isEditableTarget(originalTarget(event))
				) {
					event.preventDefault();
					this.toggleSidebar();
				}
			};
			this._window.addEventListener('keydown', keydownHandler);

			// Add resize listener with debounce
			let resizeTimeout: number;
			const resizeHandler = () => {
				if (!this._window) return;

				if (resizeTimeout) this._window.clearTimeout(resizeTimeout);
				resizeTimeout = this._window.setTimeout(() => {
					if (this._mediaQuery) this._isMobile.set(this._mediaQuery.matches);
				}, 100);
			};
			this._window.addEventListener('resize', resizeHandler);

			// Cleanup listeners on destroy
			destroyRef.onDestroy(() => {
				if (!this._window) return;

				if (this._mediaQuery) this._mediaQuery.removeEventListener('change', mediaQueryHandler);
				this._window.removeEventListener('keydown', keydownHandler);
				this._window.removeEventListener('resize', resizeHandler);
				if (resizeTimeout) this._window.clearTimeout(resizeTimeout);
			});
		});
	}

	public setOpen(open: boolean): void {
		this._open.set(open);
		this._document.cookie = `${this._config.sidebarCookieName}=${open}; path=/; max-age=${this._config.sidebarCookieMaxAge}`;
	}

	public setOpenMobile(open: boolean): void {
		if (this._isMobile()) {
			this._openMobile.set(open);
		}
	}

	public setVariant(variant: SidebarVariant): void {
		this._variant.set(variant);
	}

	public toggleSidebar(): void {
		if (this._isMobile()) {
			this._openMobile.update((value) => !value);
		} else {
			this.setOpen(!this._open());
		}
	}

	private restoreStateFromCookie(): void {
		const cookieString = isPlatformServer(this._platformId)
			? this._request?.headers.get('cookie')
			: this._document.cookie;

		if (!cookieString) return;

		const prefix = `${this._config.sidebarCookieName}=`;
		const cookieValue = cookieString
			.split(';')
			.map((c) => c.trim())
			.find((c) => c.startsWith(prefix))
			?.slice(prefix.length);

		if (cookieValue !== undefined) {
			this._open.set(cookieValue === 'true');
		}
	}
}

/**
 * Text fields and rich text editors own their keyboard shortcuts (e.g. bold, or moving the caret
 * with Ctrl+B on macOS), so the sidebar shortcut must not toggle the sidebar or prevent them there.
 */
/** The element the event started on, also when it comes from inside an open shadow root. */
function originalTarget(event: Event): EventTarget | null {
	return event.composedPath?.()[0] ?? event.target;
}

/** Input types that do not take text, so they have no use for Ctrl/Cmd+B. */
const NON_TEXT_INPUT_TYPES = new Set([
	'button',
	'checkbox',
	'color',
	'file',
	'hidden',
	'image',
	'radio',
	'range',
	'reset',
	'submit',
]);

/** The element itself, or its nearest HTML ancestor for e.g. an svg, which has no `isContentEditable`. */
function nearestHtmlElement(target: EventTarget | null): HTMLElement | null {
	let element = target as Element | null;
	while (element && typeof (element as HTMLElement).isContentEditable !== 'boolean') {
		element = element.parentElement;
	}
	return element as HTMLElement | null;
}

function isEditableTarget(target: EventTarget | null): boolean {
	const element = nearestHtmlElement(target);
	if (!element) return false;
	// inputs first: a checkbox inside an editor reports isContentEditable, but takes no text
	if (element.tagName === 'INPUT') return !NON_TEXT_INPUT_TYPES.has((element as HTMLInputElement).type);
	// isContentEditable also respects a contenteditable="false" boundary inside an editor
	if (element.isContentEditable) return true;
	return element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
}
