import { Directive, inject } from '@angular/core';
import { BrnAvatarImage } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'img[hlmAvatarImage]',
	exportAs: 'avatarImage',
	hostDirectives: [BrnAvatarImage],
	host: {
		'data-slot': 'avatar-image',
	},
})
export class HlmAvatarImage {
	public readonly canShow = inject(BrnAvatarImage).canShow;

	constructor() {
		classes(() => 'aspect-square size-full rounded-full object-cover');
	}
}
