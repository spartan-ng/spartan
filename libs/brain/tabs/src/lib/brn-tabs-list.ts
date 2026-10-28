import { FocusKeyManager } from '@angular/cdk/a11y';
import { type AfterContentInit, Directive, Injector, contentChildren, inject } from '@angular/core';
import { BrnTabs } from './brn-tabs';
import { BrnTabsTrigger } from './brn-tabs-trigger';

@Directive({
	selector: '[brnTabsList]',
	exportAs: 'brnTabsList',
	host: {
		role: 'tablist',
		'[attr.aria-orientation]': '_orientation()',
		'[attr.data-orientation]': '_orientation()',
		'(focusin)': '_onFocusIn($event)',
		'(keydown)': '_onKeydown($event)',
	},
})
export class BrnTabsList implements AfterContentInit {
	private readonly _root = inject(BrnTabs);

	protected readonly _orientation = this._root.$orientation;
	private readonly _direction = this._root.direction;
	private readonly _injector = inject(Injector);

	private _keyManager?: FocusKeyManager<BrnTabsTrigger>;

	public readonly triggers = contentChildren(BrnTabsTrigger, { descendants: true });

	public ngAfterContentInit() {
		this._keyManager = new FocusKeyManager<BrnTabsTrigger>(this.triggers, this._injector)
			.withHorizontalOrientation(this._direction())
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap();
	}

	// Activation can bypass the key manager (mouse click, programmatic change), so keep its active
	// item aligned with the trigger that actually owns DOM focus. `focusin` fires before the next
	// keydown, and focus is the correct source in manual activation mode, where focus and selection
	// are allowed to diverge.
	protected _onFocusIn(event: FocusEvent) {
		const focusedTrigger = this.triggers().find((trigger) => trigger.elementRef.nativeElement === event.target);
		if (focusedTrigger) {
			this._keyManager?.updateActiveItem(focusedTrigger);
		}
	}

	protected _onKeydown(event: KeyboardEvent) {
		if ('key' in event) {
			if (this._orientation() === 'horizontal') {
				if (event.key === 'ArrowUp' || event.key === 'ArrowDown') return;
			}
			if (this._orientation() === 'vertical') {
				if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
			}
		}
		this._keyManager?.onKeydown(event);
	}
}
