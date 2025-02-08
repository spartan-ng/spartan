import { Highlightable } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	computed,
	Directive,
	ElementRef,
	HostListener,
	inject,
	input,
	output,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { provideBrnCommandItem } from './brn-command-item.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'button[brnCommandItem]',
	standalone: true,
	providers: [provideBrnCommandItem(BrnCommandItemDirective)],
	host: {
		type: 'button',
		role: 'option',
		tabIndex: '-1',
		'[id]': 'id()',
		'[attr.disabled]': '_disabled() ? true : null',
		'[attr.data-value]': 'value()',
		'[attr.data-hidden]': "!visible() ? '' : null",
		'[attr.aria-selected]': 'active()',
		'[attr.data-selected]': "active() ? '' : null",
	},
})
export class BrnCommandItemDirective implements Highlightable {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Access the command component */
	private readonly _command = injectBrnCommand();

	/** A unique id for the item */
	public readonly id = input(`brn-command-item-${BrnCommandItemDirective._id++}`);

	/** The value this item represents. */
	public readonly value = input.required<string>();

	/** Whether the item is disabled. */
	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	/** Expose disabled as a value - used by the Highlightable interface */
	public get disabled() {
		return this._disabled();
	}

	/** Whether the item is selected. */
	protected readonly active = signal(false);

	/** Emits when the item is selected. */
	public readonly selected = output<void>();

	/** @internal Determine if this item is visible based on the current search query */
	public readonly visible = computed(() => this._command.filter()(this.value(), this._command.search()));

	/** @internal Get the display value */
	public getLabel(): string {
		return this.value();
	}

	/** @internal */
	setActiveStyles(): void {
		this.active.set(true);

		// ensure the item is in view
		if (isPlatformBrowser(this._platform)) {
			this._elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
		}
	}

	/** @internal */
	setInactiveStyles(): void {
		this.active.set(false);
	}

	@HostListener('click')
	protected onClick(): void {
		this._command.keyManager.setActiveItem(this);
		this.selected.emit();
	}
}
