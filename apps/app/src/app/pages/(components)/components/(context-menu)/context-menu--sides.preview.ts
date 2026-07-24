import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-sides',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="grid w-full max-w-sm grid-cols-2 gap-4">
			<div
				[hlmContextMenuTrigger]="menu"
				align="start"
				side="top"
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				<span class="hidden pointer-fine:inline-block">Right click (top)</span>
				<span class="hidden pointer-coarse:inline-block">Long press (top)</span>
			</div>
			<div
				[hlmContextMenuTrigger]="menu"
				align="start"
				side="right"
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				<span class="hidden pointer-fine:inline-block">Right click (right)</span>
				<span class="hidden pointer-coarse:inline-block">Long press (right)</span>
			</div>
			<div
				[hlmContextMenuTrigger]="menu"
				align="start"
				side="bottom"
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				<span class="hidden pointer-fine:inline-block">Right click (bottom)</span>
				<span class="hidden pointer-coarse:inline-block">Long press (bottom)</span>
			</div>
			<div
				[hlmContextMenuTrigger]="menu"
				align="start"
				side="left"
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				<span class="hidden pointer-fine:inline-block">Right click (left)</span>
				<span class="hidden pointer-coarse:inline-block">Long press (left)</span>
			</div>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Back</button>
					<button hlmDropdownMenuItem disabled>Forward</button>
					<button hlmDropdownMenuItem>Reload</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ContextMenuSides {}
