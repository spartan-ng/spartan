import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-with-text',
	imports: [HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button hlmToggle>
			<ng-icon hlm size="sm" name="lucideItalic" />
			<span class="ml-2">Italic</span>
		</button>
	`,
})
export class ToggleWithTextPreview {}
