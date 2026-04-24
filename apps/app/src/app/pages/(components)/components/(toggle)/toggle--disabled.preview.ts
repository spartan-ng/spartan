import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-disabled',
	imports: [HlmToggleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap items-center gap-2">
			<button hlmToggle aria-label="Toggle disabled" disabled>Disabled</button>
			<button hlmToggle variant="outline" aria-label="Toggle disabled outline" disabled>Disabled</button>
		</div>
	`,
})
export class ToggleDisabledPreview {}
