import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-with-text',
	imports: [HlmToggleImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle aria-label="Toggle italic">
			<ng-icon hlmIcon name="lucideItalic" />
			Italic
		</button>
	`,
})
export class ToggleWithTextPreview {}
