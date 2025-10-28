import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-disabled',
	imports: [HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideUnderline })],
	template: `
		<button disabled hlmToggle>
			<ng-icon hlm size="sm" name="lucideUnderline" />
		</button>
	`,
})
export class ToggleDisabledPreview {}
