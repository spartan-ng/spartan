import { Directive } from '@angular/core';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAvatarFallback]',
	exportAs: 'avatarFallback',
	hostDirectives: [BrnAvatarFallback],
	host: {
		'data-slot': 'avatar-fallback',
	},
})
export class HlmAvatarFallback {
	constructor() {
		classes(
			() =>
				'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
		);
	}
}
