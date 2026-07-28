import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-variants-preview',
	imports: [HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMarker>
			<span hlmMarkerContent>A default marker for inline notes.</span>
		</div>
		<div hlmMarker variant="separator">
			<span hlmMarkerContent>A separator marker</span>
		</div>
		<div hlmMarker variant="border">
			<span hlmMarkerContent>A border marker for row boundaries.</span>
		</div>
	`,
})
export class MarkerVariantsPreview {}
