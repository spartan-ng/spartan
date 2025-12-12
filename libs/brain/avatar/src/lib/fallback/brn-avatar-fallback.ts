import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallback {
	private readonly _element = inject(ElementRef).nativeElement;
	getTextContent(): string {
		return this._element.textContent;
	}
}
