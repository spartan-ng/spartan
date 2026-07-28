import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-border-preview',
	imports: [HlmMarkerImports, NgIcon],
	providers: [provideIcons({ lucideGitBranch, lucideSearch, lucideFileText })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-3 py-12',
	},
	template: `
		<div hlmMarker variant="border">
			<span hlmMarkerIcon>
				<ng-icon name="lucideGitBranch" />
			</span>
			<span hlmMarkerContent>Switched to release-candidate</span>
		</div>
		<div hlmMarker variant="border">
			<span hlmMarkerIcon>
				<ng-icon name="lucideSearch" />
			</span>
			<span hlmMarkerContent>Reviewed 8 related files</span>
		</div>
		<div hlmMarker variant="border">
			<span hlmMarkerIcon>
				<ng-icon name="lucideFileText" />
			</span>
			<span hlmMarkerContent>Opened implementation notes</span>
		</div>
	`,
})
export class MarkerBorderPreview {}
