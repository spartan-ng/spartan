import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, ElementRef, booleanAttribute, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[brnAvatarFallback]',
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective {
	private readonly _element = inject(ElementRef).nativeElement;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly autoColor = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	getTextContent(): string {
		return this._element.textContent;
	}
}
