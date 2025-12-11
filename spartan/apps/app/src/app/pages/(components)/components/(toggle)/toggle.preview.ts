import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark } from '@ng-icons/lucide';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-preview',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideBookmark })],
	template: `
		<button
			hlmToggle
			size="sm"
			variant="outline"
			aria-label="Toggle bookmark"
			class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-red-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-red-500"
		>
			<ng-icon name="lucideBookmark" />
			Bookmark
		</button>
	`,
})
export class TogglePreview {}

export const defaultImports = `
import { HlmToggleImports } from '@spartan-ng/helm/toggle';
`;
export const defaultSkeleton = `
<button hlmToggle>Toggle</button>
`;
