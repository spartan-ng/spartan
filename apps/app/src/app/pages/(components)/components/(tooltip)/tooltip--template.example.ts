import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-template',
	imports: [HlmButtonImports, HlmTooltipImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<button [hlmTooltip]="tooltip" hlmBtn variant="outline">Simple</button>

		<ng-template #tooltip>
			<span class="flex items-center">
				Add to library
				<ng-icon class="ml-2 text-sm" name="lucidePlus" />
			</span>
		</ng-template>
	`,
})
export class TooltipTemplate {}
