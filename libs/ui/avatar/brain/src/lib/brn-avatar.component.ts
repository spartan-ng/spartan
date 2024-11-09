import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, contentChild } from '@angular/core';
import { BrnAvatarImageDirective } from './image';

@Component({
	selector: 'brn-avatar',
	standalone: true,
	imports: [NgIf],
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
export class BrnAvatarComponent {
	protected readonly image = contentChild(BrnAvatarImageDirective);
}
