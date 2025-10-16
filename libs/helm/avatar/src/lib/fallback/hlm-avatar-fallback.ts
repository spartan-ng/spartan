import { Directive, computed, inject } from '@angular/core';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { hlm } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAvatarFallback]',
	exportAs: 'avatarFallback',
	hostDirectives: [
		{
			directive: BrnAvatarFallback,
			inputs: ['class'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAvatarFallback {
	private readonly _brn = inject(BrnAvatarFallback);

	protected readonly _computedClass = computed(() => {
		return hlm('bg-muted flex size-full items-center justify-center rounded-full', this._brn?.userClass());
	});
}
