import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { findTypesetFont } from './typeset-fonts';

/**
 * Injects Google Fonts stylesheets on demand so the builder and the standalone
 * preview render the picked families. Geist ships with the app and is skipped.
 */
@Injectable({ providedIn: 'root' })
export class TypesetFontService {
	private readonly _document = inject(DOCUMENT);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _loaded = new Set<string>();

	public load(ids: readonly string[]): void {
		if (!this._isBrowser) return;

		for (const id of ids) {
			const font = findTypesetFont(id);
			if (!font?.googleFamily || this._loaded.has(font.id)) continue;
			this._loaded.add(font.id);

			const family = font.googleFamily.replace(/ /g, '+');
			const link = this._document.createElement('link');
			link.rel = 'stylesheet';
			link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;
			link.setAttribute('data-typeset-font', font.id);
			this._document.head.appendChild(link);
		}
	}
}
