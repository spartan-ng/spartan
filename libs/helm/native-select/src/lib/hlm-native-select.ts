import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	inject,
	input,
	linkedSignal,
	output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { classes, hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const HLM_NATIVE_SELECT_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmNativeSelect),
	multi: true,
};

@Component({
	selector: 'hlm-native-select',
	imports: [NgIcon],
	providers: [
		HLM_NATIVE_SELECT_VALUE_ACCESSOR,
		provideIcons({ lucideChevronDown }),
		provideBrnLabelable(HlmNativeSelect),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnFieldControl],
	host: {
		'data-slot': 'native-select-wrapper',
		'[attr.data-size]': 'size()',
	},
	template: `
		<select
			data-slot="native-select"
			[id]="selectId()"
			[class]="_computedSelectClass()"
			[attr.data-size]="size()"
			[attr.aria-invalid]="_ariaInvalid() ? 'true' : null"
			[attr.data-invalid]="_ariaInvalid() ? 'true' : null"
			[attr.data-dirty]="_dirty?.() ? 'true' : null"
			[attr.data-touched]="_touched?.() ? 'true' : null"
			[attr.data-matches-spartan-invalid]="_spartanInvalid() ? 'true' : null"
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
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

	private static _id = 0;

	public readonly selectId = input<string>(`hlm-native-select-${HlmNativeSelect._id++}`);

	public readonly selectClass = input<ClassValue>('');

	protected readonly _computedSelectClass = computed(() =>
		hlm(
			'spartan-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
			this.selectClass(),
		),
	);

	public readonly selectIconClass = input<ClassValue>('');

	protected readonly _computedSelectIconClass = computed(() =>
		hlm('spartan-native-select-icon pointer-events-none absolute select-none', this.selectIconClass()),
	);

	public readonly size = input<'sm' | 'default'>('default');

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	/** Whether to force the input into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
	public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
		transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
		alias: 'aria-invalid',
	});

	protected readonly _ariaInvalid = computed(() => this.ariaInvalidOverride() ?? this._invalid?.());

	public readonly valueInput = input<string | undefined | null>('', { alias: 'value' });
	public readonly value = linkedSignal(this.valueInput);

	public readonly valueChange = output<string | undefined | null>();

	protected _onChange?: ChangeFn<string | undefined | null>;
	protected _onTouched?: TouchFn;

	public readonly labelableId = this.selectId;

	protected readonly _invalid = this._fieldControl?.invalid;
	protected readonly _touched = this._fieldControl?.touched;
	protected readonly _dirty = this._fieldControl?.dirty;
	protected readonly _spartanInvalid = computed(() => this.forceInvalid() || this._fieldControl?.spartanInvalid());

	constructor() {
		classes(() => 'spartan-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50');
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
	public writeValue(value: string | undefined | null): void {
		this.value.set(value);
	}

	public registerOnChange(fn: ChangeFn<string | undefined | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
