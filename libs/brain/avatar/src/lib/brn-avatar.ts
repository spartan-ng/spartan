import { ChangeDetectionStrategy, Component, contentChild } from '@angular/core';
import { BrnAvatarImage } from './image';

@Component({
	selector: 'brn-avatar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative',
	},
	template: `
		<ng-content select="[brnAvatarImage]" />
		@if (!_image()?.canShow()) {
			<ng-content select="[brnAvatarFallback]" />
		}
	`,
})
export class BrnAvatar {
	protected readonly _image = contentChild(BrnAvatarImage);
}
