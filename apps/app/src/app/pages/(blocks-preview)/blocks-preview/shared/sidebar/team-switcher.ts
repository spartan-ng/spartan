import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucidePlus } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-team-switcher',
	imports: [HlmSidebarImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideChevronsUpDown, lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ul hlmSidebarMenu>
			<li hlmSidebarMenuItem>
				<button
					hlmSidebarMenuButton
					size="lg"
					[hlmDropdownMenuTrigger]="menu"
					[side]="_menuSide()"
					align="start"
					sideOffset="4"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div
						class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						<ng-icon [name]="_activeTeam()?.icon" class="text-base" />
					</div>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-medium">{{ _activeTeam()?.name }}</span>
						<span class="truncate text-xs">{{ _activeTeam()?.plan }}</span>
					</div>
					<ng-icon name="lucideChevronsUpDown" class="ml-auto" />
				</button>
			</li>
		</ul>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56 min-w-56 rounded-lg">
				<hlm-dropdown-menu-label class="text-muted-foreground text-xs">Teams</hlm-dropdown-menu-label>
				@for (team of teams(); track team.name) {
					<button hlmDropdownMenuItem class="gap-2 p-2" (click)="activeTeam.set(team)">
						<div class="flex size-6 items-center justify-center rounded-md border">
							<ng-icon [name]="team.icon" class="text-xs" />
						</div>
						{{ team.name }}
						<span class="text-muted-foreground ml-auto text-xs">&#8984;{{ $index + 1 }}</span>
					</button>
				}
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem class="gap-2 p-2">
					<div
						class="border-muted-foreground/25 flex size-6 items-center justify-center rounded-md border bg-transparent"
					>
						<ng-icon name="lucidePlus" class="text-sm" />
					</div>
					<span class="text-muted-foreground font-medium">Add team</span>
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class TeamSwitcher {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'bottom' : 'right'));

	public readonly teams = input.required<{ name: string; icon: string; plan: string }[]>();
	protected readonly _activeTeam = signal<{ name: string; icon: string; plan: string } | null>(null);

	constructor() {
		effect(() => {
			const t = this.teams();
			if (t.length > 0 && !this._activeTeam()) {
				this._activeTeam.set(t[0]);
			}
		});
	}
}
