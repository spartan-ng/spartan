import { Component, booleanAttribute, computed, forwardRef, input, model, output, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnCheckboxComponent } from '@spartan-ng/brain/checkbox';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { HlmCheckboxCheckIconComponent } from './hlm-checkbox-checkicon.component';

export const HLM_CHECKBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmCheckboxComponent),
	multi: true,
};

@Component({
	selector: 'hlm-checkbox',
	standalone: true,
	imports: [BrnCheckboxComponent, HlmCheckboxCheckIconComponent],
	template: `
		<brn-checkbox
			[id]="id()"
			[name]="name()"
			[class]="_computedClass()"
			[checked]="checked()"
			[disabled]="state().disabled()"
			[required]="required()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
			(changed)="_handleChange()"
			(touched)="_onTouched()"
		>
			<hlm-checkbox-checkicon [class]="checkIconClass()" [iconName]="checkIconName()" />
		</brn-checkbox>
	`,
	host: {
		class: 'contents',
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	providers: [HLM_CHECKBOX_VALUE_ACCESSOR],
})
export class HlmCheckboxComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'group inline-flex border border-foreground shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' +
				' focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:text-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-background',
			this.userClass(),
			this.state().disabled() ? 'cursor-not-allowed opacity-50' : '',
		),
	);

	/** Used to set the id on the underlying brn element. */
	public readonly id = input<string | null>(null);

	/** Used to set the aria-label attribute on the underlying brn element. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	public readonly checked = model<boolean | 'indeterminate'>(false);

	public readonly name = input<string | null>(null);
	public readonly required = input(false, { transform: booleanAttribute });

	public readonly disabled = input(false, { transform: booleanAttribute });

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	// icon inputs
	public readonly checkIconName = input<string>('lucideCheck');
	public readonly checkIconClass = input<ClassValue>('');

	public readonly changed = output<boolean>();

	protected _handleChange(): void {
		if (this.state().disabled()) return;

		const previousChecked = this.checked();
		this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
		this._onChange(!previousChecked);
		this.changed.emit(!previousChecked);
	}

	/** CONROL VALUE ACCESSOR */

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	writeValue(value: any): void {
		this.checked.set(!!value);
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function,,@typescript-eslint/no-explicit-any
	protected _onChange = (_: any) => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onTouched = () => {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}
}
