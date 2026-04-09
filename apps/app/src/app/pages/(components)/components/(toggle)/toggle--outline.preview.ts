import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-outline',
	imports: [HlmToggleImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle variant="outline" aria-label="Toggle Italic">
			<ng-icon hlmIcon name="lucideItalic" />
		</button>
	`,
})
export class ToggleOutlinePreview {}
