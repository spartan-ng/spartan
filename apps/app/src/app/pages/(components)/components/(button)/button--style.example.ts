import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-style',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideCircleFadingArrowUp })],

	template: `
		<div class="flex flex-wrap items-center justify-center gap-2 md:flex-row">
			<button hlmBtn>Button</button>
			<button hlmBtn variant="secondary">Secondary</button>
			<button hlmBtn variant="ghost">Ghost</button>
			<button hlmBtn variant="outline">Outline</button>
			<button hlmBtn variant="link">Link</button>
			<button hlmBtn variant="destructive">Destructive</button>
		</div>

		<div class="mt-2 flex flex-wrap items-center justify-center gap-2 md:flex-row">
			<button hlmBtn size="icon">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
			<button hlmBtn size="icon" variant="secondary">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
			<button hlmBtn size="icon" variant="ghost">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
			<button hlmBtn size="icon" variant="outline">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
			<button hlmBtn size="icon" variant="link">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
			<button hlmBtn size="icon" variant="destructive">
				<ng-icon name="lucideCircleFadingArrowUp" />
			</button>
		</div>
	`,
})
export class ButtonStyleExample {}
