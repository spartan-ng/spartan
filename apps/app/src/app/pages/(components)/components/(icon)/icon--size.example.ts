import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-icon-size',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<div class="flex items-center gap-6">
			<ng-icon hlm size="sm" name="lucideChevronRight" />
			<ng-icon hlm name="lucideChevronRight" />
			<ng-icon hlm size="lg" name="lucideChevronRight" />
			<ng-icon hlm size="xl" name="lucideChevronRight" />
			<ng-icon hlm size="64px" name="lucideChevronRight" />
		</div>
	`,
})
export class IconSizePreview {}
