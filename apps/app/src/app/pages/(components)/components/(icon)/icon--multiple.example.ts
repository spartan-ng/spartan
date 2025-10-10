import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleArrowUp } from '@ng-icons/lucide';
import { remixAngularjsLine } from '@ng-icons/remixicon';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-icon-multiple-sets',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCircleArrowUp, remixAngularjsLine })],
	template: `
		<div class="flex items-center gap-6">
			<div class="flex flex-col items-center gap-1">
				<ng-icon hlm size="xl" name="lucideCircleArrowUp" />
				<span class="text-muted-foreground text-sm">lucideCircleArrowUp</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<ng-icon hlm size="xl" name="remixAngularjsLine" />
				<span class="text-muted-foreground text-sm">remixAngularjsLine</span>
			</div>
		</div>
	`,
})
export class IconMultipleSetsPreview {}
