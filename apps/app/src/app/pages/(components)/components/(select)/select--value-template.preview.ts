import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideAlignCenter,
	lucideAlignJustify,
	lucideAlignLeft,
	lucideAlignRight,
} from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-value-template-preview',
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
		<hlm-select class="inline-block" placeholder="Select an alignment">
			<hlm-select-trigger class="w-56">
				<hlm-select-value>
					<div class="flex items-center gap-x-2" *brnSelectValue="let value">
						<ng-icon [name]="value.icon" />
						{{ value.label }}
					</div>
				</hlm-select-value>
			</hlm-select-trigger>
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
export class SelectValueTemplatePreview {
	public readonly options = [
		{ label: 'Align Left', icon: 'lucideAlignLeft' },
		{ label: 'Align Center', icon: 'lucideAlignCenter' },
		{ label: 'Align Justify', icon: 'lucideAlignJustify' },
		{ label: 'Align Right', icon: 'lucideAlignRight' },
	];
}
