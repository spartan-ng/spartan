import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-icon-preview',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<div>
			<ng-icon hlm size="xl" name="lucideChevronRight" />
		</div>
	`,
})
export class IconPreview {}

export const defaultImports = `
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
`;

export const defaultSkeleton = `
<ng-icon hlm size="sm" name="lucideChevronRight" />
`;
