import {
	afterNextRender,
	computed,
	DestroyRef,
	DOCUMENT,
	inject,
	Injectable,
	type Signal,
	signal,
} from '@angular/core';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

export type SidebarVariant = 'sidebar' | 'floating' | 'inset';

@Injectable({ providedIn: 'root' })
export class HlmSidebarService {
	private readonly _config = injectHlmSidebarConfig();
	private readonly _document = inject(DOCUMENT);
	private readonly _window = this._document.defaultView;
	private readonly _open = signal<boolean>(true);
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
		afterNextRender(() => {
			if (!this._window) return;
			// Initialize from cookie
			const cookie = this._document.cookie
				.split('; ')
				.find((row) => row.startsWith(`${this._config.sidebarCookieName}=`));

			if (cookie) {
				const value = cookie.split('=')[1];
				this._open.set(value === 'true');
			}

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
				if (event.key === this._config.sidebarKeyboardShortcut && (event.ctrlKey || event.metaKey)) {
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
}
