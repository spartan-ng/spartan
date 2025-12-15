import { Directive, ElementRef, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallback {
	// don't dereference nativeElement at class init time
	private readonly _elRef = inject(ElementRef);
	private readonly _platformId = inject(PLATFORM_ID);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	getTextContent(): string {
		// guard for SSR and any runtime DOM errors
		if (!isPlatformBrowser(this._platformId)) return '';
		try {
			const el = this._elRef.nativeElement as HTMLElement | null;
			return el?.textContent?.trim() ?? '';
		} catch {
			return '';
		}
	}
}
