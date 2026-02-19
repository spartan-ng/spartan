import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	linkedSignal,
	model,
	output,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { classes, hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

// TODO support BrnFormFieldControl
export const HLM_NATIVE_SELECT_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmNativeSelect),
	multi: true,
};

@Component({
	selector: 'hlm-native-select',
	imports: [NgIcon],
	providers: [HLM_NATIVE_SELECT_VALUE_ACCESSOR, provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'native-select-wrapper',
		'[attr.data-size]': 'size()',
	},
	template: `
		<select
			data-slot="native-select"
			[id]="_selectId()"
			[class]="_computedSelectClass()"
			[attr.data-size]="size()"
			[attr.aria-invalid]="ariaInvalid() ? 'true' : null"
			[value]="value()"
			[disabled]="_disabled()"
			(change)="_valueChanged($event)"
			(blur)="_blur()"
		>
			<ng-content />
		</select>

		<ng-icon
			name="lucideChevronDown"
			[class]="_computedSelectIconClass()"
			aria-hidden="true"
			data-slot="native-select-icon"
		/>
	`,
})
export class HlmNativeSelect implements ControlValueAccessor {
	private static _id = 0;

	public readonly selectId = input<string>('');

	protected readonly _selectId = computed(() => this.selectId() || `hlm-native-select-${HlmNativeSelect._id++}`);

	public readonly selectClass = input<ClassValue>('');

	protected readonly _computedSelectClass = computed(() =>
		hlm(
			'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-8',
			// TODO support BrnFormFieldControl
			'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-3',
			this.selectClass(),
		),
	);

	public readonly selectIconClass = input<ClassValue>('');

	protected readonly _computedSelectIconClass = computed(() =>
		hlm(
			'text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-base select-none',
			this.selectIconClass(),
		),
	);

	public readonly size = input<'sm' | 'default'>('default');

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	public readonly ariaInvalid = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
		alias: 'aria-invalid',
	});

	public readonly value = model<string | null>('');

	public readonly valueChange = output<string | null>();

	protected _onChange?: ChangeFn<string | null>;
	protected _onTouched?: TouchFn;

	constructor() {
		classes(() => 'group/native-select relative w-fit has-[select:disabled]:opacity-50');
	}

	protected _valueChanged(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this.value.set(value);
		this.valueChange.emit(value);
		this._onChange?.(value);
		this._onTouched?.();
	}

	protected _blur(): void {
		this._onTouched?.();
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: string | null): void {
		this.value.set(value);
	}

	public registerOnChange(fn: ChangeFn<string | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
