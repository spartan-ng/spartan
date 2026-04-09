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
			<ng-icon hlmIcon size="sm" name="lucideChevronRight" />
			<ng-icon hlmIcon name="lucideChevronRight" />
			<ng-icon hlmIcon size="lg" name="lucideChevronRight" />
			<ng-icon hlmIcon size="xl" name="lucideChevronRight" />
			<ng-icon hlmIcon size="64px" name="lucideChevronRight" />
		</div>
	`,
})
export class IconSizePreview {}
