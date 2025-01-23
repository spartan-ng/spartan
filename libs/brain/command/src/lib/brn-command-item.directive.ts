import { Highlightable } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	Directive,
	ElementRef,
	HostListener,
	inject,
	input,
	output,
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
		'[attr.disabled]': '_disabled() ? true : null',
		'[attr.data-value]': 'value()',
		'[attr.data-hidden]': "!visible() ? '' : null",
		'[attr.aria-selected]': '_selected()',
		'[attr.data-selected]': "_selected() ? '' : null",
	},
})
export class BrnCommandItemDirective implements Highlightable {
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the command component */
	private readonly _command = injectBrnCommand();

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
	protected readonly _selected = computed(() => this._command.value() === this.value());

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
		this.selected.emit();
		this._changeDetector.markForCheck();

		// ensure the item is in view
		this._elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
	}

	/** @internal */
	setInactiveStyles(): void {
		this._changeDetector.markForCheck();
	}

	@HostListener('click')
	protected onClick(): void {
		this._command.keyManager.setActiveItem(this);
	}
}
