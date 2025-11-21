import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBadgeCheck,
	lucideBell,
	lucideChevronsUpDown,
	lucideCreditCard,
	lucideLogOut,
	lucideSparkles,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-user',
	imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
	providers: [
		provideIcons({
			lucideChevronsUpDown,
			lucideSparkles,
			lucideBadgeCheck,
			lucideCreditCard,
			lucideBell,
			lucideLogOut,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let u = user();
		<ul hlmSidebarMenu>
			<li hlmSidebarMenuItem>
				<button hlmSidebarMenuButton size="lg" [hlmDropdownMenuTrigger]="menu" [side]="_menuSide()" align="end">
					<hlm-avatar class="rounded-lg">
						<img [src]="u.avatar" [alt]="u.name" hlmAvatarImage />
						<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
					</hlm-avatar>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-medium">{{ u.name }}</span>
						<span class="truncate text-xs">{{ u.email }}</span>
					</div>
					<ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
				</button>
			</li>
		</ul>

		<ng-template #menu>
			<hlm-dropdown-menu class="min-w-56 rounded-lg">
				<hlm-dropdown-menu-label>
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<hlm-avatar class="rounded-lg">
							<img [src]="u.avatar" [alt]="u.name" hlmAvatarImage />
							<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
						</hlm-avatar>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{{ u.name }}</span>
							<span class="truncate text-xs">{{ u.email }}</span>
						</div>
					</div>
				</hlm-dropdown-menu-label>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideSparkles" />
						Upgrade to Pro
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideBadgeCheck" />
						Account
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideCreditCard" />
						Billing
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideBell" />
						Notifications
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideLogOut" />
					Log out
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class NavUser {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'top' : 'right'));

	public readonly user = input.required<{
		name: string;
		email: string;
		avatar: string;
	}>();
}
