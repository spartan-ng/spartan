import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-size',
	imports: [HlmToggleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap items-center gap-2">
			<button hlmToggle variant="outline" size="sm" aria-label="Toggle small">Small</button>
			<button hlmToggle variant="outline" aria-label="Toggle default">Default</button>
			<button hlmToggle variant="outline" size="lg" aria-label="Toggle large">Large</button>
		</div>
	`,
})
export class ToggleSizePreview {}
