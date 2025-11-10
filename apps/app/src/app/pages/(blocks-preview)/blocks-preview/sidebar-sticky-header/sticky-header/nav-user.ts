import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-user',
	imports: [HlmSidebarImports, HlmAvatarImports, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown })],
	template: `
		<ul hlmSidebarMenu>
			<li hlmSidebarMenuItem>
				<button hlmSidebarMenuButton>
					<hlm-avatar variant="large">
						<img src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" hlmAvatarImage />
						<span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
					</hlm-avatar>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-medium">spartan</span>
						<span class="truncate text-xs">hello&#64;spartan.ng</span>
					</div>
					<ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
				</button>
			</li>
		</ul>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavUser {}
