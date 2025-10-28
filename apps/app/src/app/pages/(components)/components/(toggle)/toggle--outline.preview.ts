import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-outline',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle variant="outline" aria-label="Toggle Italic">
			<ng-icon name="lucideItalic" />
		</button>
	`,
})
export class ToggleOutlinePreview {}
