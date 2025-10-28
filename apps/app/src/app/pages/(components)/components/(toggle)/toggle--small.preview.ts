import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-small',
	imports: [HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="sm" hlmToggle>
			<ng-icon hlm size="sm" name="lucideItalic" />
		</button>
	`,
})
export class ToggleSmallPreview {}
