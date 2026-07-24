import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-styles-complex-showcase',
	imports: [HlmCardImports, HlmBadgeImports, HlmInputImports, HlmSelectImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideCheck })],
	host: {
		class: 'flex w-80',
	},
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Card Title</h3>
				<p hlmCardDescription>Card description here</p>
				<div hlmCardAction>
					<span hlmBadge>Badge</span>
				</div>
			</hlm-card-header>
			<div hlmCardContent>
				<div class="flex flex-col gap-4">
					<input hlmInput placeholder="Enter text..." />
					<hlm-select [itemToString]="itemToString">
						<hlm-select-trigger class="w-full">
							<hlm-select-value placeholder="Select option" />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-item value="1">Option 1</hlm-select-item>
							<hlm-select-item value="2">Option 2</hlm-select-item>
							<hlm-select-item value="3">Option 3</hlm-select-item>
						</hlm-select-content>
					</hlm-select>
					<div class="flex gap-2">
						<button hlmBtn variant="outline" class="flex-1">Cancel</button>
						<button hlmBtn class="flex-1">
							<ng-icon name="lucideCheck" class="mr-1" />
							Submit
						</button>
					</div>
				</div>
			</div>
		</hlm-card>
	`,
})
export class StylesComplexShowcase {
	protected readonly itemToString = (value: unknown) => `${value}`;
}
