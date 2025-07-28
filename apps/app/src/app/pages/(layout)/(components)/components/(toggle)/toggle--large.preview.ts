import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmToggleDirective } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-large',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="lg" brnToggle hlm>
			<ng-icon hlm size="lg" name="lucideItalic" />
		</button>
	`,
})
export class ToggleLargePreviewComponent {}
