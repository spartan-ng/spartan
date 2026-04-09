import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';

import { TitleCasePipe } from '@angular/common';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { STYLES } from '@spartan-ng/registry';

@Component({
	selector: 'spartan-style-options-dropdown',
	imports: [HlmDropdownMenuImports, HlmButton, HlmIcon, TitleCasePipe],
	providers: [provideIcons({ lucideCheck, lucideChevronDown })],
	template: `
		<button hlmBtn size="sm" variant="secondary" side="bottom" align="end" [hlmDropdownMenuTrigger]="menu">
			Style {{ _styleService.style() | titlecase }}
			<ng-icon hlmIcon name="lucideChevronDown" />
		</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				@let selectedStyle = _styleService.style();

				@for (style of _styles; track style) {
					<button hlmDropdownMenuItem (click)="_styleService.style.set(style)">
						{{ style | titlecase }}
						@if (selectedStyle === style) {
							<ng-icon hlmIcon class="ml-auto" name="lucideCheck" />
						}
					</button>
				}
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class StyleOptionsDropdown {
	protected readonly _styleService = inject(StyleService);

	protected readonly _styles = STYLES;
}
