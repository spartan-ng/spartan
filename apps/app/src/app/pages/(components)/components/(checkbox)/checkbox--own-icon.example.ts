import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-own-icon',
	imports: [HlmLabelDirective, HlmCheckboxComponent],
	providers: [provideIcons({ lucideMoon })],
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" checkIconName="lucideMoon" />
			Accept terms and conditions
		</label>
	`,
})
export class CheckboxOwnIconComponent {}

export const checkboxOwnIconCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-own-icon',
	standalone: true,
	imports: [HlmLabelDirective, HlmCheckboxComponent],
	providers: [provideIcons({ lucideMoon })],
	template: \`
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" checkIconName="lucideMoon" />
			Accept terms and conditions
		</label>
	\`,
})
export class CheckboxOwnIconComponent {}
`;
