import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp })],
	template: `
		<div class="flex flex-wrap items-center gap-2 md:flex-row">
			<button hlmBtn variant="outline">Button</button>
			<button hlmBtn variant="outline" size="icon" aria-label="Submit">
				<ng-icon name="lucideArrowUp" />
			</button>
		</div>
	`,
})
export class ButtonPreview {}

export const defaultImports = `
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
