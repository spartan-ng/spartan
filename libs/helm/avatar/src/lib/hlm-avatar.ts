import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnAvatar } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'avatar',
		'[attr.data-size]': 'size()',
	},
	template: `
		@if (_image()?.canShow()) {
			<ng-content select="[hlmAvatarImage],[brnAvatarImage]" />
		} @else {
			<ng-content select="[hlmAvatarFallback],[brnAvatarFallback]" />
		}
		<ng-content />
	`,
})
export class HlmAvatar extends BrnAvatar {
	public readonly size = input<'default' | 'sm' | 'lg'>('default');

	constructor() {
		super();
		classes(
			() =>
				'after:border-border group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
		);
	}
}
