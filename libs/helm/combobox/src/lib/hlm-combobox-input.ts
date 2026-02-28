import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideX } from '@ng-icons/lucide';
import {
	BrnComboboxImports,
	BrnComboboxInputWrapper,
	BrnComboboxPopoverTrigger,
	injectBrnComboboxBase,
} from '@spartan-ng/brain/combobox';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'hlm-combobox-input',
	imports: [HlmInputGroupImports, NgIcon, BrnComboboxImports, BrnComboboxPopoverTrigger],
	providers: [provideIcons({ lucideChevronDown, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnComboboxInputWrapper],
	template: `
		<hlm-input-group brnComboboxAnchor class="w-auto">
			<input
				brnComboboxInput
				#comboboxInput="brnComboboxInput"
				brnComboboxPopoverTrigger
				hlmInputGroupInput
				[placeholder]="placeholder()"
				[attr.aria-invalid]="ariaInvalid() ? 'true' : null"
			/>

			<hlm-input-group-addon align="inline-end">
				@if (showTrigger()) {
					<button
						brnComboboxPopoverTrigger
						hlmInputGroupButton
						data-slot="input-group-button"
						[disabled]="comboboxInput.disabled()"
						size="icon-xs"
						variant="ghost"
						class="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
					>
						<ng-icon name="lucideChevronDown" />
					</button>
				}

				@if (showClear()) {
					<button
						*brnComboboxClear
						hlmInputGroupButton
						data-slot="combobox-clear"
						[disabled]="comboboxInput.disabled()"
						size="icon-xs"
						variant="ghost"
					>
						<ng-icon name="lucideX" />
					</button>
				}
			</hlm-input-group-addon>

			<ng-content />
		</hlm-input-group>
	`,
})
export class HlmComboboxInput {
	private readonly _combobox = injectBrnComboboxBase();

	public readonly placeholder = input<string>('');

	public readonly showTrigger = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
	public readonly showClear = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Manual override for aria-invalid. When not set, auto-detects from the parent combobox error state. */
	public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
		transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
		alias: 'aria-invalid',
	});

	/** Computed aria-invalid: uses manual override if provided, otherwise reads from parent error state. */
	public readonly ariaInvalid = computed(() => this.ariaInvalidOverride() ?? this._combobox.errorState());
}
