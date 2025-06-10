import { Directive, computed, inject, input } from '@angular/core';
import { BrnAvatarImageDirective } from '@spartan-ng/brain/avatar';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'img[hlmAvatarImage]',
	exportAs: 'avatarImage',
	hostDirectives: [BrnAvatarImageDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAvatarImageDirective {
	public canShow = inject(BrnAvatarImageDirective).canShow;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('aspect-square object-cover h-full w-full', this.userClass()));
}
