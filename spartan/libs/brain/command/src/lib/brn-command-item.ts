import type { Highlightable } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	computed,
	Directive,
	ElementRef,
	inject,
	input,
	type OnInit,
	output,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { provideBrnCommandItem } from './brn-command-item.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'button[brnCommandItem]',
	providers: [provideBrnCommandItem(BrnCommandItem)],
	host: {
		type: 'button',
		role: 'option',
		tabIndex: '-1',
		'[id]': 'id()',
		'[attr.disabled]': '_disabled() ? true : null',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'[attr.data-value]': 'value()',
		'[attr.data-hidden]': "!visible() ? '' : null",
		'[attr.aria-selected]': '_active()',
		'[attr.data-selected]': "_active() ? '' : null",
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
	},
})
export class BrnCommandItem implements Highlightable, OnInit {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Access the command component */
	private readonly _command = injectBrnCommand();

	/** A unique id for the item */
	public readonly id = input<string>(`brn-command-item-${++BrnCommandItem._id}`);

	/** The value this item represents. */
	public readonly value = input.required<string>();

	/** Whether the item is disabled. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	/** Expose disabled as a value - used by the Highlightable interface */
	public get disabled() {
		return this._disabled();
	}

	/** Whether the item is initialized, this is to prevent accessing the value-input before the component is initialized.
	 * The brn-command-empty directive accesses the value before the component is initialized, which causes an error.
	 */
	private readonly _initialized = signal(false);

	/** Whether the item is selected. */
	protected readonly _active = signal(false);

	/** Emits when the item is selected. */
	public readonly selected = output<void>();

	/** @internal Determine if this item is visible based on the current search query */
	public readonly visible = computed(() => {
		return this._command.filter()(this.safeValue(), this._command.search());
	});

	/** @internal Get the value of the item, with check if it has been initialized to avoid errors */
	public readonly safeValue = computed(() => {
		if (!this._initialized()) {
			return '';
		}
		return this.value();
	});

	/** @internal Get the display value */
	public getLabel(): string {
		return this.safeValue();
	}

	/** @internal */
	setActiveStyles(): void {
		this._active.set(true);

		// ensure the item is in view
		if (isPlatformBrowser(this._platform)) {
			this._elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
		}
	}

	/** @internal */
	setInactiveStyles(): void {
		this._active.set(false);
	}

	protected onClick(): void {
		this._command.keyManager.setActiveItem(this);
		this.selected.emit();
	}

	protected activate(): void {
		if (this._disabled()) {
			return;
		}

		this._command.keyManager.setActiveItem(this);
	}

	ngOnInit(): void {
		this._initialized.set(true);
	}
}
