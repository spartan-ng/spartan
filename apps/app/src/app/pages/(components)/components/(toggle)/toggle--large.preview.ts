import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-large',
	imports: [HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="lg" hlmToggle>
			<ng-icon hlm size="lg" name="lucideItalic" />
		</button>
	`,
})
export class ToggleLargePreview {}
