import { DestroyRef, Injectable, Signal, afterNextRender, computed, inject, signal } from '@angular/core';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const MOBILE_BREAKPOINT = '768px';

@Injectable({ providedIn: 'root' })
export class HlmSidebarService {
	private readonly _open = signal<boolean>(true);
	private readonly _openMobile = signal<boolean>(false);
	private readonly _isMobile = signal<boolean>(false);
	private readonly _variant = signal<'sidebar' | 'floating' | 'inset'>('sidebar');
	private _mediaQuery: MediaQueryList | null = null;

	public readonly open: Signal<boolean> = this._open.asReadonly();
	public readonly openMobile: Signal<boolean> = this._openMobile.asReadonly();
	public readonly isMobile: Signal<boolean> = this._isMobile.asReadonly();
	public readonly variant: Signal<'sidebar' | 'floating' | 'inset'> = this._variant.asReadonly();

	public readonly state = computed<'expanded' | 'collapsed'>(() => (this._open() ? 'expanded' : 'collapsed'));

	constructor() {
		const destroyRef = inject(DestroyRef);
		afterNextRender(() => {
			if (typeof window === 'undefined' || typeof document === 'undefined') return;

			// Initialize from cookie
			const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));

			if (cookie) {
				const value = cookie.split('=')[1];
				this._open.set(value === 'true');
			}

			// Initialize MediaQueryList
			this._mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT})`);
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
				if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.ctrlKey || event.metaKey)) {
					event.preventDefault();
					this.toggleSidebar();
				}
			};
			window.addEventListener('keydown', keydownHandler);

			// Add resize listener with debounce
			let resizeTimeout: number;
			const resizeHandler = () => {
				if (resizeTimeout) window.clearTimeout(resizeTimeout);
				resizeTimeout = window.setTimeout(() => {
					if (this._mediaQuery) this._isMobile.set(this._mediaQuery.matches);
				}, 100);
			};
			window.addEventListener('resize', resizeHandler);

			// Cleanup listeners on destroy
			destroyRef.onDestroy(() => {
				if (this._mediaQuery) this._mediaQuery.removeEventListener('change', mediaQueryHandler);
				window.removeEventListener('keydown', keydownHandler);
				window.removeEventListener('resize', resizeHandler);
				if (resizeTimeout) window.clearTimeout(resizeTimeout);
			});
		});
	}

	public setOpen(open: boolean): void {
		this._open.set(open);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}

	public setOpenMobile(open: boolean): void {
		if (this._isMobile()) this._openMobile.set(open);
	}

	public setVariant(variant: 'sidebar' | 'floating' | 'inset'): void {
		this._variant.set(variant);
	}

	public toggleSidebar(): void {
		if (this._isMobile()) this._openMobile.update((value) => !value);
		else this.setOpen(!this._open());
	}
}
