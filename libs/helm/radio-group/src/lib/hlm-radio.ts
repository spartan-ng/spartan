import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	output,
	PLATFORM_ID,
	Renderer2,
	signal,
} from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnRadio, BrnRadioChange } from '@spartan-ng/brain/radio-group';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio',
	imports: [BrnRadio],
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
			<ng-content select="[target],[indicator],hlm-radio-indicator" indicator />
			<ng-content />
		</brn-radio>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.id]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.data-disabled]': '_state().disabled() ? "" : null',
	},
})
export class HlmRadio<T = unknown> {
	private readonly _document = inject(DOCUMENT);
	private readonly _renderer = inject(Renderer2);
	private readonly _elementRef = inject(ElementRef);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'group flex items-center gap-x-3',
			this.userClass(),
			this._state().disabled() ? 'cursor-not-allowed opacity-50' : '',
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

	protected readonly _state = computed(() => {
		const id = this.id();
		return {
			disabled: signal(this.disabled()),
			id: id ? id : null,
		};
	});
	/**
	 * Event emitted when the checked state of this radio button changes.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	public readonly change = output<BrnRadioChange<T>>();

	constructor() {
		effect(() => {
			const state = this._state();
			const isDisabled = state.disabled();

			if (!this._elementRef.nativeElement || !this._isBrowser) return;

			const labelElement =
				this._elementRef.nativeElement.closest('label') ?? this._document.querySelector(`label[for="${state.id}"]`);

			if (!labelElement) return;
			this._renderer.setAttribute(labelElement, 'data-disabled', isDisabled ? 'true' : 'false');
		});
	}
}
