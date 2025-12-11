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
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmSwitchThumb } from './hlm-switch-thumb';

export const HLM_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmSwitch),
	multi: true,
};

@Component({
	selector: 'hlm-switch',
	imports: [BrnSwitchThumb, BrnSwitch, HlmSwitchThumb],
	providers: [HLM_SWITCH_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'contents',
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	template: `
		<brn-switch
			[class]="_computedClass()"
			[checked]="checked()"
			(checkedChange)="handleChange($event)"
			(touched)="_onTouched?.()"
			[disabled]="_disabled()"
			[id]="id()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
		>
			<brn-switch-thumb hlm />
		</brn-switch>
	`,
})
export class HlmSwitch implements ControlValueAccessor {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
			this.userClass(),
		),
	);

	/** The checked state of the switch. */
	public readonly checked = model<boolean>(false);

	/** Emits when the checked state of the switch changes. */
	public readonly checkedChange = output<boolean>();

	/** The disabled state of the switch. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Used to set the id on the underlying brn element. */
	public readonly id = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying brn element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	protected readonly _disabled = linkedSignal(this.disabled);

	protected _onChange?: ChangeFn<boolean>;
	protected _onTouched?: TouchFn;

	protected handleChange(value: boolean): void {
		this.checked.set(value);
		this._onChange?.(value);
		this.checkedChange.emit(value);
	}

	/** CONROL VALUE ACCESSOR */

	writeValue(value: boolean): void {
		this.checked.set(Boolean(value));
	}

	registerOnChange(fn: ChangeFn<boolean>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
