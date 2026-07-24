import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-outline',
	imports: [HlmToggleGroupImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-toggle-group variant="outline" value="all">
			<button hlmToggleGroupItem value="all" aria-label="Toggle all">All</button>
			<button hlmToggleGroupItem value="missed" aria-label="Toggle missed">Missed</button>
		</hlm-toggle-group>
	`,
})
export class ToggleGroupOutlinePreview {}
