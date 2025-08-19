import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-disabled',
	imports: [BrnToggle, HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideUnderline })],
	template: `
		<button disabled brnToggle hlm>
			<ng-icon hlm size="sm" name="lucideUnderline" />
		</button>
	`,
})
export class ToggleDisabledPreview {}
