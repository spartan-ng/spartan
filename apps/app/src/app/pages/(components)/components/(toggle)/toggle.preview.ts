import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-preview',
	imports: [HlmToggleImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideBookmark })],
	template: `
		<button
			hlmToggle
			size="sm"
			variant="outline"
			aria-label="Toggle bookmark"
			class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-red-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-red-500"
		>
			<ng-icon hlmIcon name="lucideBookmark" />
			Bookmark
		</button>
	`,
})
export class TogglePreview {}

export const defaultImports = `
import { HlmToggleImports } from '@spartan-ng/helm/toggle';
import { HlmIcon } from '@spartan-ng/helm/icon';
`;
export const defaultSkeleton = `
<button hlmToggle>Toggle</button>
`;
