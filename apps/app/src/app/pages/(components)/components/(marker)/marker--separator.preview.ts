import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-separator-preview',
	imports: [HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMarker variant="separator">
			<span hlmMarkerContent>Today</span>
		</div>
		<div hlmMarker variant="separator">
			<span hlmMarkerContent>Worked for 42s</span>
		</div>
		<div hlmMarker variant="separator">
			<span hlmMarkerContent>Conversation compacted</span>
		</div>
	`,
})
export class MarkerSeparatorPreview {}
