import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { classes } from '@spartan-ng/helm/utils';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HlmDropdownMenuFocusOnHover } from './hlm-dropdown-menu-focus-on-hover';

@Directive({
	selector: '[hlmDropdownMenuItem],hlm-dropdown-menu-item',
	exportAs: 'hlmDropdownMenuItem',
	hostDirectives: [
		{
			directive: CdkMenuItem,
			inputs: ['cdkMenuItemDisabled: disabled'],
			outputs: ['cdkMenuItemTriggered: triggered'],
		},
		HlmDropdownMenuFocusOnHover,
	],
	host: {
		'data-slot': 'dropdown-menu-item',
		// CDK keeps disabled menu items focusable. Also clear a static disabled attribute from the host.
		'[attr.disabled]': 'null',
		'[attr.data-disabled]': 'disabled() ? "" : null',
		'[attr.data-variant]': 'variant()',
		'[attr.data-inset]': 'inset() ? "" : null',
	},
})
export class HlmDropdownMenuItem {
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly variant = input<'default' | 'destructive'>('default');

	public readonly inset = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		fromEvent(this._elementRef.nativeElement, 'click')
			.pipe(
				filter(() => this.disabled()),
				takeUntilDestroyed(),
			)
			.subscribe((event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
			});

		classes(
			() =>
				'spartan-dropdown-menu-item group/dropdown-menu-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
