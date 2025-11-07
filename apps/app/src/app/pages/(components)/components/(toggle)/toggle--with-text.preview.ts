import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-with-text',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle aria-label="Toggle italic">
			<ng-icon name="lucideItalic" />
			Italic
		</button>
	`,
})
export class ToggleWithTextPreview {}
