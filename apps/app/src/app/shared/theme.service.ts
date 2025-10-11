import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

const DarkModes = ['light', 'dark'] as const;
export type DarkMode = (typeof DarkModes)[number];

export const AppThemes = ['default', 'gray', 'red', 'green'] as const;
export type Theme = (typeof AppThemes)[number];

export const Layouts = ['full', 'fixed'] as const;
export type Layout = (typeof Layouts)[number];

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _renderer = inject(RendererFactory2).createRenderer(null, null);
	private readonly _document = inject(DOCUMENT);
	private readonly _query = inject(MediaMatcher).matchMedia('(prefers-color-scheme: dark)');
	private readonly _darkMode$ = new ReplaySubject<'light' | 'dark'>(1);
	public darkMode$ = this._darkMode$.asObservable();

	private readonly _theme = signal<Theme | undefined>(undefined);
	public readonly theme = this._theme.asReadonly();
	private readonly _layout = signal<Layout | undefined>(undefined);
	public readonly layout = this._layout.asReadonly();

	constructor() {
		this.syncInitialStateFromLocalStorage();
		this.toggleClassOnDarkModeChanges();
	}

	private syncInitialStateFromLocalStorage(): void {
		if (isPlatformBrowser(this._platformId)) {
			this._darkMode$.next((localStorage.getItem('darkMode') as DarkMode) ?? 'light');
			this.setTheme((localStorage.getItem('theme') as Theme) ?? 'default');
			this.setLayout((localStorage.getItem('layout') as Layout) ?? 'fixed');
		}
	}
	private toggleClassOnDarkModeChanges(): void {
		this.darkMode$.pipe(takeUntilDestroyed()).subscribe((darkMode) => {
			if (darkMode === 'dark') {
				this._renderer.addClass(this._document.documentElement, 'dark');
			} else {
				if (this._document.documentElement.className.includes('dark')) {
					this._renderer.removeClass(this._document.documentElement, 'dark');
				}
			}
		});
	}
	public setDarkMode(newMode: DarkMode): void {
		localStorage.setItem('darkMode', newMode);
		this._darkMode$.next(newMode);
	}

	public toggleMode(): void {
		this.darkMode$.pipe(take(1)).subscribe((currentMode) => {
			this.setDarkMode(currentMode === 'dark' ? 'light' : 'dark');
		});
	}

	public setTheme(newTheme: Theme): void {
		const oldTheme = this._theme();
		this._renderer.removeClass(this._document.body, `theme-${oldTheme}`);
		this._theme.set(newTheme);

		if (newTheme === 'default') {
			localStorage.removeItem('theme');
			return;
		}

		this._renderer.addClass(this._document.body, `theme-${newTheme}`);
		localStorage.setItem('theme', newTheme);
	}

	public setLayout(layout: Layout): void {
		const oldLayout = this._layout();
		this._renderer.removeClass(this._document.documentElement, `layout-${oldLayout}`);
		this._layout.set(layout);
		this._renderer.addClass(this._document.documentElement, `layout-${layout}`);
		localStorage.setItem('layout', layout);
	}
}
