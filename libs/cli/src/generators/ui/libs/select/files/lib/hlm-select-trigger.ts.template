import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	computed,
	contentChild,
	inject,
	input,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnComboboxTrigger, BrnComboboxInput, injectBrnComboboxBase, BrnComboboxInputWrapper } from '@spartan-ng/brain/combobox';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { selectTriggerVariants } from './select-trigger-variants';

@Component({
	selector: 'hlm-select-trigger',
	imports: [BrnComboboxTrigger, BrnComboboxInput, NgIcon, HlmIcon],
	hostDirectives: [BrnComboboxInputWrapper],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-size]': 'size()',
		'(click)': 'open()',
	},
	template: `
		<ng-content select="[hlmSelectPrefix]" />
		<!-- Use Combobox Input wrapper with readonly. We enforce readonly here so it acts as select. -->
		<input brnComboboxTrigger brnComboboxInput readonly class="min-w-0 flex-1 cursor-pointer bg-transparent outline-none" />
		<ng-content select="[hlmSelectSuffix]" />
		@if (_icon()) {
			<ng-content select="ng-icon" />
		} @else {
			<ng-icon hlm size="sm" class="ml-2 flex-none" name="lucideChevronDown" />
		}
	`,
})
export class HlmSelectTrigger implements AfterViewInit {
	protected readonly _icon = contentChild(HlmIcon);
	private readonly _elementRef = inject(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _combobox = injectBrnComboboxBase();
	private readonly _popover = inject(BrnPopover, { optional: true });

	constructor() {
		if (this._popover) {
			this._popover.mutableAttachTo.set(this._elementRef.nativeElement);
		}
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly size = input<'default' | 'sm'>('default');

    // Defaulting to auto for styling
    public readonly errorState = input<boolean | 'auto'>('auto');

	protected readonly _computedClass = computed(() =>
		hlm(selectTriggerVariants({ error: this.errorState() as 'auto' }), this.userClass()),
	);

	public open(): void {
		this._combobox.open();
	}

	ngAfterViewInit(): void {
		// Replace triggerWidth calculation logic
        // We will need BrnCombobox to have searchInputWrapperWidth updated from here perhaps?
		const el = this._elementRef.nativeElement;
        // BrnCombobox takes wrapper width from BrnComboboxInputWrapper.
        // HlmSelectTrigger isn't strictly providing that if it doesn't hook into it.
        // But HlmComboboxContent already matches brn-combobox-width.
	}
}
