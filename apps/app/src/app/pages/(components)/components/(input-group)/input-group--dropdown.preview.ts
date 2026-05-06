import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-dropdown-preview',
	imports: [HlmInputGroupImports, HlmIconImports, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis, lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Enter file name" />

			<hlm-input-group-addon align="inline-end">
				<button
					hlmInputGroupButton
					variant="ghost"
					aria-label="More"
					size="icon-xs"
					[hlmDropdownMenuTrigger]="fileMenu"
					align="end"
				>
					<ng-icon name="lucideEllipsis" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group class="[--radius:1rem]">
			<input hlmInputGroupInput placeholder="Enter search query" />

			<hlm-input-group-addon align="inline-end">
				<button
					hlmInputGroupButton
					variant="ghost"
					class="pe-1.5! text-xs"
					[hlmDropdownMenuTrigger]="searchMenu"
					align="end"
				>
					Search In...
					<ng-icon name="lucideChevronDown" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>

		<ng-template #fileMenu>
			<hlm-dropdown-menu class="w-48">
				<button hlmDropdownMenuItem>Settings</button>
				<button hlmDropdownMenuItem>Copy path</button>
				<button hlmDropdownMenuItem>Open location</button>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #searchMenu>
			<hlm-dropdown-menu class="w-56 [--radius:0.95rem]">
				<button hlmDropdownMenuItem>Documentation</button>
				<button hlmDropdownMenuItem>Blog Posts</button>
				<button hlmDropdownMenuItem>Changelog</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class InputGroupDropdownPreview {}
