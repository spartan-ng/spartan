import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-marker-status-preview',
	imports: [HlmMarkerImports, HlmSpinner],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMarker role="status">
			<span hlmMarkerIcon>
				<hlm-spinner />
			</span>
			<span hlmMarkerContent>Compacting conversation</span>
		</div>
		<div hlmMarker variant="separator" role="status">
			<span hlmMarkerIcon>
				<hlm-spinner />
			</span>
			<span hlmMarkerContent>Running tests</span>
		</div>
	`,
})
export class MarkerStatusPreview {}
