import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-outline',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideItalic, lucideBold })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap items-center gap-2">
			<button hlmToggle variant="outline" aria-label="Toggle Italic">
				<ng-icon name="lucideItalic" />
				Italic
			</button>
			<button hlmToggle variant="outline" aria-label="Toggle Bold">
				<ng-icon name="lucideBold" />
				Bold
			</button>
		</div>
	`,
})
export class ToggleOutlinePreview {}
