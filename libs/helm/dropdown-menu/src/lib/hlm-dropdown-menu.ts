import { type NumberInput } from '@angular/cdk/coercion';
import { CdkMenu } from '@angular/cdk/menu';
import { Directive, ElementRef, inject, input, numberAttribute, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deriveMenuSideFromTransformOrigin } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDropdownMenu],hlm-dropdown-menu',
	hostDirectives: [CdkMenu],
	host: {
		'data-slot': 'dropdown-menu',
		'[attr.data-state]': '_state()',
		'[attr.data-side]': '_side()',
		'[style.--side-offset]': 'sideOffset()',
	},
})
export class HlmDropdownMenu {
	private readonly _host = inject(CdkMenu);
	private readonly _elementRef = inject(ElementRef<HTMLElement>);

	protected readonly _state = signal('open');
	protected readonly _side = signal('top');

	public readonly sideOffset = input<number, NumberInput>(1, { transform: numberAttribute });

	constructor() {
		classes(
			() =>
				'spartan-dropdown-menu-content my-[--spacing(var(--side-offset))] overflow-x-hidden overflow-y-auto outline-none',
		);

		this.setSideFromTransformOrigin();
		// this is a best effort, but does not seem to work currently
		// TODO: figure out a way for us to know the host is about to be closed. might not be possible with CDK
		this._host.closed.pipe(takeUntilDestroyed()).subscribe(() => this._state.set('closed'));
	}

	private setSideFromTransformOrigin() {
		// peek() is undefined only before this menu is pushed onto the stack, which tells us root vs submenu
		const isRoot = this._host.menuStack.peek() === undefined;
		// CDK sets transform-origin on this element synchronously on attach; read it next tick and derive side
		setTimeout(() => {
			const transformOrigin = this._elementRef.nativeElement.style.transformOrigin;
			if (transformOrigin) {
				this._side.set(deriveMenuSideFromTransformOrigin(transformOrigin, isRoot));
			}
		});
	}
}
