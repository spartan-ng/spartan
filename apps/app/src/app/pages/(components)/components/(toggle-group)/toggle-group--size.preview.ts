import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-size',
	imports: [HlmToggleGroupImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-col gap-4">
			<hlm-toggle-group type="single" size="sm" variant="outline" value="top">
				<button hlmToggleGroupItem value="top" aria-label="Toggle top">Top</button>
				<button hlmToggleGroupItem value="bottom" aria-label="Toggle bottom">Bottom</button>
				<button hlmToggleGroupItem value="left" aria-label="Toggle left">Left</button>
				<button hlmToggleGroupItem value="right" aria-label="Toggle right">Right</button>
			</hlm-toggle-group>
			<hlm-toggle-group type="single" variant="outline" value="top">
				<button hlmToggleGroupItem value="top" aria-label="Toggle top">Top</button>
				<button hlmToggleGroupItem value="bottom" aria-label="Toggle bottom">Bottom</button>
				<button hlmToggleGroupItem value="left" aria-label="Toggle left">Left</button>
				<button hlmToggleGroupItem value="right" aria-label="Toggle right">Right</button>
			</hlm-toggle-group>
		</div>
	`,
})
export class ToggleGroupSizePreview {}
