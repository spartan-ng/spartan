import { ChangeDetectionStrategy, Component, ViewEncapsulation, contentChild } from '@angular/core';
import { BrnAvatarImage } from './image';

@Component({
	selector: 'brn-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		@if (image()?.canShow()) {
			<ng-content select="[brnAvatarImage]" />
		} @else {
			<ng-content select="[brnAvatarFallback]" />
		}
	`,
})
export class BrnAvatar {
	protected readonly image = contentChild(BrnAvatarImage);
}
