import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-outline',
	imports: [HlmToggleGroupImports, HlmIconImports],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	template: `
		<hlm-toggle-group type="multiple" variant="outline">
			<button hlmToggleGroupItem value="bold" aria-label="Toggle bold">
				<ng-icon hlm size="sm" name="lucideBold" />
			</button>

			<button hlmToggleGroupItem value="italic" aria-label="Toggle italic">
				<ng-icon hlm size="sm" name="lucideItalic" />
			</button>

			<button hlmToggleGroupItem value="underline" aria-label="Toggle underline">
				<ng-icon hlm size="sm" name="lucideUnderline" />
			</button>
		</hlm-toggle-group>
	`,
})
export class ToggleGroupOutlinePreview {}
