import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
	BrnComboboxAnchor,
	BrnComboboxInputWrapper,
	BrnComboboxPopoverTrigger,
	BrnComboboxTrigger,
} from '@spartan-ng/brain/combobox';
import { ButtonVariants, HlmButton } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-combobox-trigger',
	imports: [NgIcon, HlmButton, BrnComboboxAnchor, BrnComboboxTrigger, BrnComboboxPopoverTrigger],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnComboboxInputWrapper],
	template: `
		<button
			brnComboboxTrigger
			brnComboboxAnchor
			brnComboboxPopoverTrigger
			hlmBtn
			data-slot="combobox-trigger"
			[id]="buttonId()"
			[class]="_computedClass()"
			[variant]="variant()"
		>
			<ng-content />
			<ng-icon name="lucideChevronDown" />
		</button>
	`,
})
export class HlmComboboxTrigger {
	private static _id = 0;

	public readonly buttonId = input<string>(`hlm-combobox-trigger-${HlmComboboxTrigger._id++}`);

	public readonly userClass = input<ClassValue>('', {
		alias: 'class',
	});
	protected readonly _computedClass = computed(() => hlm(this.userClass()));

	public readonly variant = input<ButtonVariants['variant']>('outline');
}
