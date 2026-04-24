import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark } from '@ng-icons/lucide';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-preview',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideBookmark })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			hlmToggle
			size="sm"
			variant="outline"
			aria-label="Toggle bookmark"
			class="data-[state=on]:*:[ng-icon]:*:[svg]:fill-foreground data-[state=on]:bg-transparent"
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
