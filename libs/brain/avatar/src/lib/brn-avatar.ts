import { ChangeDetectionStrategy, Component, ViewEncapsulation, contentChild } from '@angular/core';
import { BrnAvatarImage } from './image';

@Component({
	selector: 'brn-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		@if (_image()?.canShow()) {
			<ng-content select="[brnAvatarImage]" />
		} @else {
			<ng-content select="[brnAvatarFallback]" />
		}
	`,
})
export class BrnAvatar {
	protected readonly _image = contentChild(BrnAvatarImage);
}
