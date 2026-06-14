import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideGalleryVerticalEnd } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-version-switcher',
	imports: [HlmSidebarImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideGalleryVerticalEnd, lucideChevronsUpDown, lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ul hlmSidebarMenu>
			<li hlmSidebarMenuItem>
				<button
					hlmSidebarMenuButton
					size="lg"
					[hlmDropdownMenuTrigger]="menu"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div
						class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						<ng-icon name="lucideGalleryVerticalEnd" class="text-base" />
					</div>
					<div class="flex flex-col gap-0.5 leading-none">
						<span class="font-medium">Documentation</span>
						<span>v{{ _selectedVersion() }}</span>
					</div>
					<ng-icon name="lucideChevronsUpDown" class="ml-auto" />
				</button>
			</li>
		</ul>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start">
				@for (version of versions(); track version) {
					<button hlmDropdownMenuItem (click)="_selectedVersion.set(version)">
						v{{ version }}
						@if (version === _selectedVersion()) {
							<ng-icon name="lucideCheck" class="ml-auto" />
						}
					</button>
				}
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class VersionSwitcher {
	public readonly versions = input.required<string[]>();
	protected readonly _selectedVersion = signal('');

	constructor() {
		effect(() => {
			const v = this.versions();
			if (v.length > 0 && !this._selectedVersion()) {
				this._selectedVersion.set(v[0]);
			}
		});
	}
}
