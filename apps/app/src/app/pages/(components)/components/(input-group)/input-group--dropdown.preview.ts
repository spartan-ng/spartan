import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-input-group-dropdown-preview',
	imports: [HlmInputGroupImports, HlmIconImports, BrnMenuImports, HlmMenuImports],
	providers: [
		provideIcons({
			lucideEllipsis,
			lucideChevronDown,
		}),
	],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Enter file name" />

			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					variant="ghost"
					aria-label="More"
					size="icon-xs"
					[brnMenuTriggerFor]="fileMenu"
					align="end"
				>
					<ng-icon name="lucideEllipsis" />
				</button>
			</div>
		</div>
		<div hlmInputGroup class="[--radius:1rem]">
			<input hlmInputGroupInput placeholder="Enter search query" />

			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					variant="ghost"
					class="!pr-1.5 text-xs"
					[brnMenuTriggerFor]="searchMenu"
					align="end"
				>
					Search In...
					<ng-icon name="lucideChevronDown" />
				</button>
			</div>
		</div>

		<ng-template #fileMenu>
			<hlm-menu class="w-48">
				<button hlmMenuItem>Settings</button>
				<button hlmMenuItem>Copy path</button>
				<button hlmMenuItem>Open location</button>
			</hlm-menu>
		</ng-template>

		<ng-template #searchMenu>
			<hlm-menu class="w-56 [--radius:0.95rem]">
				<button hlmMenuItem>Documentation</button>
				<button hlmMenuItem>Blog Posts</button>
				<button hlmMenuItem>Changelog</button>
			</hlm-menu>
		</ng-template>
	`,
})
export class InputGroupDropdownPreview {}
