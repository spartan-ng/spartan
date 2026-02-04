import { Directive, ElementRef, inject } from '@angular/core';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmDialogClose]',
	hostDirectives: [{ directive: BrnDialogClose, inputs: ['delay'] }],
	host: {
		'data-slot': 'dialog-close',
	},
})
export class HlmDialogClose {
	private readonly _element = inject(ElementRef);

	constructor() {
		const isInFooter = this._isInsideFooter();

		classes(() => [
			'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground flex items-center justify-center rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none [&_ng-icon]:shrink-0',
			!isInFooter && 'absolute end-4 top-4',
		]);
	}

	private _isInsideFooter(): boolean {
		let parent = this._element.nativeElement.parentElement;
		while (parent) {
			if (parent.getAttribute('data-slot') === 'dialog-footer') {
				return true;
			}
			if (parent.getAttribute('data-slot') === 'dialog-content') {
				return false;
			}
			parent = parent.parentElement;
		}
		return false;
	}
}
