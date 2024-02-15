import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixChevronDown, radixChevronUp } from '@ng-icons/radix-icons';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-multiple-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	providers: [provideIcons({ radixChevronUp, radixChevronDown })],
	template: `
		<brn-select class="inline-block" placeholder="Select options" [multiple]="true">
			<hlm-select-trigger>
				<brn-select-value hlm />
			</hlm-select-trigger>
			<hlm-select-content class="w-56">
				<hlm-option value="Refresh">Refresh</hlm-option>
				<hlm-option value="Settings">Settings</hlm-option>
				<hlm-option value="Help">Help</hlm-option>
				<hlm-option value="Signout">Sign out</hlm-option>
			</hlm-select-content>
		</brn-select>
	`,
})
export class SelectMultiplePreviewComponent {}

export const multipleCode = `import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixChevronDown, radixChevronUp } from '@ng-icons/radix-icons';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-multiple-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	providers: [provideIcons({ radixChevronUp, radixChevronDown })],
	template: \`
		<brn-select class="inline-block" placeholder="Select options" [multiple]="true">
			<hlm-select-trigger>
				<brn-select-value hlm />
			</hlm-select-trigger>
			<hlm-select-content class="w-56">
				<hlm-option value="Refresh">Refresh</hlm-option>
				<hlm-option value="Settings">Settings</hlm-option>
				<hlm-option value="Help">Help</hlm-option>
				<hlm-option value="Signout">Sign out</hlm-option>
			</hlm-select-content>
		</brn-select>
	\`,
})
export class SelectMultiplePreviewComponent {}`;
