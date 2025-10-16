import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggle } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-preview',
	imports: [BrnToggle, HlmToggle, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button brnToggle hlm>
			<ng-icon hlm size="sm" name="lucideItalic" />
		</button>
	`,
})
export class TogglePreview {}

export const defaultImports = `
import { HlmToggle } from '@spartan-ng/helm/toggle';
import { BrnToggle } from '@spartan-ng/brain/toggle';
`;
export const defaultSkeleton = `
<button brnToggle hlm>
  <ng-icon hlm size="sm" name="lucideItalic" />
</button>
`;
