import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-icon-responsive',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<ng-icon hlmIcon class="text-xl sm:text-2xl md:text-4xl lg:text-6xl" name="lucideChevronRight" />
	`,
})
export class IconResponsivePreview {}
