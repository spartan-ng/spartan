import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnComboboxAnchor, BrnComboboxInputWrapper } from '@spartan-ng/brain/combobox';
import { ButtonVariants, HlmButton } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmComboboxPopoverTrigger } from './hlm-combobox-popover-trigger';

@Component({
	selector: 'hlm-combobox-trigger',
	imports: [NgIcon, HlmButton, BrnComboboxAnchor, HlmComboboxPopoverTrigger],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnComboboxInputWrapper],
	template: `
		<button
			brnComboboxAnchor
			hlmComboboxPopoverTrigger
			hlmBtn
			data-slot="combobox-trigger"
			[class]="_computedClass()"
			[variant]="variant()"
			[disabled]="disabled()"
		>
			<ng-content />
			<ng-icon name="lucideChevronDown" />
		</button>
	`,
})
export class HlmComboboxTrigger {
	public readonly userClass = input<ClassValue>('', {
		alias: 'class',
	});
	protected readonly _computedClass = computed(() => hlm(this.userClass()));

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly variant = input<ButtonVariants['variant']>('outline');
}
