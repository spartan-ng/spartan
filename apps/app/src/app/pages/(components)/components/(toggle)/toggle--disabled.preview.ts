import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-disabled',
	imports: [HlmToggleImports, HlmIconImports],
	providers: [provideIcons({ lucideUnderline })],
	template: `
		<button hlmToggle aria-label="Toggle underline" disabled>
			<ng-icon hlm size="sm" name="lucideUnderline" />
		</button>
	`,
})
export class ToggleDisabledPreview {}
