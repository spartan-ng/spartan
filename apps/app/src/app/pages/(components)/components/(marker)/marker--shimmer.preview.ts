import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-shimmer-preview',
	imports: [HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMarker role="status">
			<span hlmMarkerContent class="shimmer">Thinking...</span>
		</div>
		<div hlmMarker variant="separator" role="status">
			<span hlmMarkerContent class="shimmer">Reading 4 files</span>
		</div>
	`,
})
export class MarkerShimmerPreview {}
