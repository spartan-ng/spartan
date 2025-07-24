import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-outline',
	imports: [BrnToggle, HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button brnToggle hlm variant="outline">
			<ng-icon hlm size="sm" name="lucideItalic" />
		</button>
	`,
})
export class ToggleOutlinePreview {}
