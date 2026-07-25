import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-marker-preview',
	imports: [HlmMarkerImports, HlmSpinner, NgIcon],
	providers: [provideIcons({ lucideGitBranch, lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMarker>
			<span hlmMarkerIcon>
				<ng-icon name="lucideGitBranch" />
			</span>
			<span hlmMarkerContent>Switched to a new branch</span>
		</div>
		<div hlmMarker role="status">
			<span hlmMarkerIcon>
				<hlm-spinner />
			</span>
			<span hlmMarkerContent class="shimmer">Thinking...</span>
		</div>
		<div hlmMarker variant="separator">
			<span hlmMarkerContent>Conversation compacted</span>
		</div>
		<div hlmMarker>
			<span hlmMarkerIcon>
				<ng-icon name="lucideSearch" />
			</span>
			<span hlmMarkerContent>Explored 4 files</span>
		</div>
	`,
})
export class MarkerPreview {}

export const defaultImports = `
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
`;

export const defaultSkeleton = `
<div hlmMarker role="status">
  <span hlmMarkerIcon>
    <hlm-spinner />
  </span>
  <span hlmMarkerContent class="shimmer">Checking the logs...</span>
</div>
`;
