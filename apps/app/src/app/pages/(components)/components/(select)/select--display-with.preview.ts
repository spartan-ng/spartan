import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlignCenter, lucideAlignJustify, lucideAlignLeft, lucideAlignRight } from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';

type AlignOption = { label: string; icon: string };

@Component({
	selector: 'spartan-select-display-with-preview',
	imports: [HlmSelectImports, NgIcon],
	providers: [
		provideIcons({
			lucideAlignLeft,
			lucideAlignCenter,
			lucideAlignJustify,
			lucideAlignRight,
		}),
	],
	template: `
		<hlm-select class="inline-block" placeholder="Select an alignment" [displayWith]="getLabel">
			<hlm-select-trigger class="w-56" />
			<hlm-select-content>
				@for (option of options; track option.label) {
					<hlm-option [value]="option">
						<ng-icon [name]="option.icon" class="mr-2" />
						{{ option.label }}
					</hlm-option>
				}
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectDisplayWithPreview {
	public readonly options: AlignOption[] = [
		{ label: 'Align Left', icon: 'lucideAlignLeft' },
		{ label: 'Align Center', icon: 'lucideAlignCenter' },
		{ label: 'Align Justify', icon: 'lucideAlignJustify' },
		{ label: 'Align Right', icon: 'lucideAlignRight' },
	];

	public readonly getLabel = (option: AlignOption) => option.label;
}
