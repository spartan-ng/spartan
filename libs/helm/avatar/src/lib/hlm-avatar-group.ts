import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAvatarGroup],hlm-avatar-group',
	host: {
		'data-slot': 'avatar-group',
	},
})
export class HlmAvatarGroup {
	constructor() {
		classes(
			() => '*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2',
		);
	}
}
