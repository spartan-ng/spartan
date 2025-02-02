import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnRadioChange, BrnRadioComponent } from '@spartan-ng/brain/radio-group';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio',
	standalone: true,
	imports: [BrnRadioComponent],
	template: `
		<brn-radio
			[id]="id()"
			[class]="_computedClass()"
			[value]="value()"
			[required]="required()"
			[disabled]="disabled()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
			(change)="change.emit($event)"
		>
			<ng-content select="[target],[indicator]" indicator />
			<ng-content />
		</brn-radio>
	`,
})
export class HlmRadioComponent<T = unknown> {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'group [&.brn-radio-disabled]:text-muted-foreground flex items-center space-x-2 rtl:space-x-reverse',
			this.userClass(),
		),
	);

	/** Used to set the id on the underlying brn element. */
	public readonly id = input<string | undefined>(undefined);

	/** Used to set the aria-label attribute on the underlying brn element. */
	public readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

	/** Used to set the aria-labelledby attribute on the underlying brn element. */
	public readonly ariaLabelledby = input<string | undefined>(undefined, { alias: 'aria-labelledby' });

	/** Used to set the aria-describedby attribute on the underlying brn element. */
	public readonly ariaDescribedby = input<string | undefined>(undefined, { alias: 'aria-describedby' });

	/**
	 * The value this radio button represents.
	 */
	public readonly value = input.required<T>();

	/** Whether the checkbox is required. */
	public readonly required = input(false, { transform: booleanAttribute });

	/** Whether the checkbox is disabled. */
	public readonly disabled = input(false, { transform: booleanAttribute });

	/**
	 * Event emitted when the checked state of this radio button changes.
	 */
	public readonly change = output<BrnRadioChange<T>>();
}
