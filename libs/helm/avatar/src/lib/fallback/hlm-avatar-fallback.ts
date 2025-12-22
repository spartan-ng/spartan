import { Directive } from '@angular/core';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAvatarFallback]',
	exportAs: 'avatarFallback',
	hostDirectives: [
		{
			directive: BrnAvatarFallback,
		},
	],
})
export class HlmAvatarFallback {
	constructor() {
		classes(() => 'bg-muted flex size-full items-center justify-center rounded-full');
	}
}
