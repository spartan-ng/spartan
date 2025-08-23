import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-large',
	imports: [BrnToggle, HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="lg" brnToggle hlm>
			<ng-icon hlm size="lg" name="lucideItalic" />
		</button>
	`,
})
export class ToggleLargePreview {}
