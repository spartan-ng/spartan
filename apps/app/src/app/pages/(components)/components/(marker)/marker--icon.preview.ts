import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpenCheck, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-icon-preview',
	imports: [HlmMarkerImports, NgIcon],
	providers: [provideIcons({ lucideGitBranch, lucideSearch, lucideBookOpenCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-12 py-12',
	},
	template: `
		<div hlmMarker>
			<span hlmMarkerIcon>
				<ng-icon name="lucideGitBranch" />
			</span>
			<span hlmMarkerContent>Switched to a new branch</span>
		</div>
		<div hlmMarker variant="separator">
			<span hlmMarkerIcon>
				<ng-icon name="lucideSearch" />
			</span>
			<span hlmMarkerContent>Explored 4 files</span>
		</div>
		<div hlmMarker class="flex-col">
			<span hlmMarkerIcon>
				<ng-icon name="lucideBookOpenCheck" />
			</span>
			<span hlmMarkerContent>Syncing completed</span>
		</div>
	`,
})
export class MarkerIconPreview {}
