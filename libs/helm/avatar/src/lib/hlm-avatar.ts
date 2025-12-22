import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnAvatar } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (_image()?.canShow()) {
			<ng-content select="[hlmAvatarImage],[brnAvatarImage]" />
		} @else {
			<ng-content select="[hlmAvatarFallback],[brnAvatarFallback]" />
		}
	`,
})
export class HlmAvatar extends BrnAvatar {
	constructor() {
		super();
		classes(() => 'relative flex size-8 shrink-0 overflow-hidden rounded-full');
	}
}
