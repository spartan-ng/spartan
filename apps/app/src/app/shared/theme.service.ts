import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	effect,
	inject,
	Injectable,
	PLATFORM_ID,
	RendererFactory2,
	signal,
	untracked,
	WritableSignal,
} from '@angular/core';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DarkModes = ['light', 'dark', 'system'] as const;
export type DarkMode = (typeof DarkModes)[number];

export const AppThemes = ['default', 'gray', 'red', 'green'] as const;
export type Theme = (typeof AppThemes)[number];

export const Layouts = ['full', 'fixed'] as const;
export type Layout = (typeof Layouts)[number];

export const LogoVariants = ['default', 'legacy'] as const;
export type LogoVariant = (typeof LogoVariants)[number];

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _document = inject(DOCUMENT);
	private readonly _renderer = inject(RendererFactory2).createRenderer(null, null);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _query = inject(MediaMatcher).matchMedia('(prefers-color-scheme: dark)');

	private readonly _darkMode!: WritableSignal<DarkMode>;
	private readonly _systemPrefersDark = signal<boolean>(false);
	private readonly _theme = signal<Theme>('default');
	private readonly _layout = signal<Layout>('fixed');
	private readonly _logoVariant = signal<LogoVariant>('default');

	public readonly theme = this._theme.asReadonly();
	public readonly layout = this._layout.asReadonly();
	public readonly logoVariant = this._logoVariant.asReadonly();

	constructor() {
		if (!isPlatformBrowser(this._platformId)) return;
		const mode = (localStorage.getItem('darkMode') as DarkMode) ?? 'system';

		this._darkMode = injectLocalStorage('darkMode', {
			defaultValue: mode,
			storageSync: true,
			parse: (val) => String(val) as DarkMode,
			stringify: (val) => val,
		});
		this._systemPrefersDark.set(this._query.matches);
		if (mode === 'system') {
			untracked(() => this._darkMode.set('system'));
		}

		const handleChange = (e: MediaQueryListEvent) => this._systemPrefersDark.set(e.matches);
		this._query.addEventListener('change', handleChange);
		this._destroyRef.onDestroy(() => this._query.removeEventListener('change', handleChange));
		this._theme.set((localStorage.getItem('theme') as Theme) ?? 'default');
		this._layout.set((localStorage.getItem('layout') as Layout) ?? 'fixed');
		const storedLogoVariant = localStorage.getItem('logoVariant');
		this._logoVariant.set(
			LogoVariants.includes(storedLogoVariant as LogoVariant) ? (storedLogoVariant as LogoVariant) : 'default',
		);

		effect(() => {
			const mode = this._darkMode();
			const systemDark = this._systemPrefersDark();
			const shouldBeDark = mode === 'dark' || (mode === 'system' && systemDark);

			if (shouldBeDark) {
				this._renderer.addClass(this._document.documentElement, 'dark');
			} else {
				if (this._document.documentElement.className.includes('dark')) {
					this._renderer.removeClass(this._document.documentElement, 'dark');
				}
			}
		});

		effect(() => {
			const newTheme = this._theme();
			const oldTheme = this._document.body.className.match(/theme-(\w+)/)?.[1];

			if (oldTheme) {
				this._document.body.classList.remove(`theme-${oldTheme}`);
			}

			if (newTheme !== 'default') {
				this._document.body.classList.add(`theme-${newTheme}`);
			}
		});

		effect(() => {
			const newVariant = this._logoVariant();
			const oldVariant = this._document.documentElement.className.match(/logo-(\w+)/)?.[1];

			if (oldVariant) {
				this._document.documentElement.classList.remove(`logo-${oldVariant}`);
			}

			this._document.documentElement.classList.add(`logo-${newVariant}`);

			// Keep the browser-tab favicon in sync with the variant (mirrors the boot script in index.html).
			const favicon = this._document.querySelector('link[rel="icon"]');
			if (favicon) {
				const href = newVariant === 'legacy' ? '/assets/spartan-legacy.svg' : '/assets/spartan.svg';
				this._renderer.setAttribute(favicon, 'href', href);
			}
		});

		effect(() => {
			const newLayout = this._layout();
			const oldLayout = this._document.documentElement.className.match(/layout-(\w+)/)?.[1];

			if (oldLayout) {
				this._document.documentElement.classList.remove(`layout-${oldLayout}`);
			}

			this._document.documentElement.classList.add(`layout-${newLayout}`);
		});
	}

	public toggleMode(): void {
		const mode = this._darkMode();
		this.setDarkMode(mode === 'light' ? 'dark' : 'light');
	}

	public setDarkMode(mode: DarkMode): void {
		this._darkMode.set(mode);
	}

	public setTheme(theme: Theme): void {
		if (theme === 'default') {
			localStorage.removeItem('theme');
		} else {
			localStorage.setItem('theme', theme);
		}
		this._theme.set(theme);
	}

	public setLayout(layout: Layout): void {
		localStorage.setItem('layout', layout);
		this._layout.set(layout);
	}

	public setLogoVariant(variant: LogoVariant): void {
		if (variant === 'default') {
			localStorage.removeItem('logoVariant');
		} else {
			localStorage.setItem('logoVariant', variant);
		}
		this._logoVariant.set(variant);
	}

	public toggleLogoVariant(): void {
		this.setLogoVariant(this._logoVariant() === 'legacy' ? 'default' : 'legacy');
	}
}
