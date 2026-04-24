import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-vertical',
	imports: [HlmToggleGroupImports, NgIcon],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-toggle-group type="multiple" orientation="vertical" spacing="1" [value]="['bold', 'italic']">
			<button hlmToggleGroupItem value="bold" aria-label="Toggle bold">
				<ng-icon name="lucideBold" />
			</button>

			<button hlmToggleGroupItem value="italic" aria-label="Toggle italic">
				<ng-icon name="lucideItalic" />
			</button>

			<button hlmToggleGroupItem value="underline" aria-label="Toggle underline">
				<ng-icon name="lucideUnderline" />
			</button>
		</hlm-toggle-group>
	`,
})
export class ToggleGroupVerticalPreview {}
