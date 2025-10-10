import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
	selector: 'spartan-icon-responsive',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<ng-icon class="text-xl sm:text-2xl md:text-4xl lg:text-6xl" name="lucideChevronRight" />
	`,
})
export class IconResponsivePreview {}
