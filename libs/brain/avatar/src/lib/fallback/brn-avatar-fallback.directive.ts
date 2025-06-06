import { Directive, ElementRef, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective {
	private readonly _element = inject(ElementRef).nativeElement;
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	getTextContent(): string {
		return this._element.textContent;
	}
}
