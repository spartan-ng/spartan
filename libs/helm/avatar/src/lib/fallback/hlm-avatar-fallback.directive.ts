import { Directive, computed, inject } from '@angular/core';
import { BrnAvatarFallbackDirective } from '@spartan-ng/brain/avatar';
import { hlm } from '@spartan-ng/brain/core';

@Directive({
	selector: '[hlmAvatarFallback]',
	exportAs: 'avatarFallback',
	hostDirectives: [
		{
			directive: BrnAvatarFallbackDirective,
			inputs: ['class'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAvatarFallbackDirective {
	private readonly _brn = inject(BrnAvatarFallbackDirective);

	protected readonly _computedClass = computed(() => {
		return hlm('bg-muted flex size-full items-center justify-center rounded-full', this._brn?.userClass());
	});
}
