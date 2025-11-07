import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-large',
	imports: [HlmToggleImports, HlmIconImports],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle size="lg" aria-label="Toggle italic">
			<ng-icon hlm size="lg" name="lucideItalic" />
		</button>
	`,
})
export class ToggleLargePreview {}
