import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	contentChildren,
	Directive,
	effect,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	output,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnCommandItemToken } from './brn-command-item.token';
import { type CommandFilter, injectBrnCommandConfig, provideBrnCommand } from './brn-command.token';

export const BRN_COMMAND_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnCommand),
	multi: true,
};

@Directive({
	selector: '[brnCommand]',
	providers: [provideBrnCommand(BrnCommand), BRN_COMMAND_VALUE_ACCESSOR],
	host: {
		'[id]': 'id()',
		'(keydown.enter)': 'selectActiveItem()',
	},
})
export class BrnCommand implements ControlValueAccessor {
	private static _id = 0;

	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnCommandConfig();

	/** The id of the command */
	public readonly id = input<string>(`brn-command-${++BrnCommand._id}`);

	/** A custom filter function to use when searching. */
	public readonly filter = input<CommandFilter>(this._config.filter);

	/** Whether the command is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	private readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** when the selection has changed */
	public readonly valueChange = output<string>();

	/** The current search query. */
	public readonly search = model<string>('');

	/** @internal Access all the items within the command */
	public readonly items = contentChildren(BrnCommandItemToken, {
		descendants: true,
	});

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	protected _onChange?: ChangeFn<string | null>;
	protected _onTouched?: TouchFn;

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.skipPredicate((item) => item.disabled || !item.visible());

		// When clearing the search input we also want to reset the active item to the first one
		effect(() => {
			const searchInput = this.search();
			untracked(() => {
				const activeItemIsVisible = this.keyManager.activeItem?.visible();
				if ((searchInput !== undefined && searchInput.length === 0) || !activeItemIsVisible) {
					this.keyManager.setFirstItemActive();
				}
			});
		});

		this.keyManager.change.pipe(takeUntilDestroyed()).subscribe(() => {
			const value = this.keyManager.activeItem?.safeValue();
			if (value) {
				this.valueChange.emit(value);
			}
		});

		afterNextRender(() => {
			if (this.items().length) {
				this.keyManager.setActiveItem(0);
			}
		});
	}

	protected selectActiveItem(): void {
		this.keyManager.activeItem?.selected.emit();
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: string | null): void {
		if (value) {
			this.search.set(value);
		}
	}

	registerOnChange(fn: ChangeFn<string | null>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
