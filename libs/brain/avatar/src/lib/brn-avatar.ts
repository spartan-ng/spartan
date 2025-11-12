import { ChangeDetectionStrategy, Component, ViewEncapsulation, contentChild } from '@angular/core';
import { BrnAvatarImage } from './image';

@Component({
	selector: 'brn-avatar',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
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
