import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideArrowUp })],
	host: { class: 'flex flex-wrap items-center gap-2 md:flex-row' },
	template: `
		<button hlmBtn variant="outline">Button</button>
		<button hlmBtn size="icon" variant="outline">
			<ng-icon hlmIcon name="lucideArrowUp" />
		</button>
	`,
})
export class ButtonPreview {}

export const defaultImports = `
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
