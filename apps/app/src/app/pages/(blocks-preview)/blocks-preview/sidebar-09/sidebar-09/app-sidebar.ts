import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArchiveX, lucideCommand, lucideFile, lucideInbox, lucideSend, lucideTrash2 } from '@ng-icons/lucide';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { data } from '../../shared/sidebar/data';
import { NavUser } from '../../shared/sidebar/nav-user';

@Component({
	selector: 'spartan-sidebar-09',
	imports: [HlmSidebarImports, NgIcon, HlmLabel, HlmSwitchImports, NavUser],
	providers: [
		provideIcons({
			lucideInbox,
			lucideFile,
			lucideSend,
			lucideArchiveX,
			lucideTrash2,
			lucideCommand,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar collapsible="icon" class="overflow-hidden *:data-[sidebar=sidebar]:flex-row">
			<!-- Outer sidebar: icon-only nav -->
			<hlm-sidebar collapsible="none" class="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
				<hlm-sidebar-header>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<a hlmSidebarMenuButton size="lg" href="#" class="md:h-8 md:p-0">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<ng-icon name="lucideCommand" class="text-base" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">Acme Inc</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
							</a>
						</li>
					</ul>
				</hlm-sidebar-header>
				<hlm-sidebar-content>
					<hlm-sidebar-group>
						<div hlmSidebarGroupContent class="px-1.5 md:px-0">
							<ul hlmSidebarMenu>
								@for (item of navMail; track item.title) {
									<li hlmSidebarMenuItem>
										<button
											hlmSidebarMenuButton
											[isActive]="_activeItem()?.title === item.title"
											class="px-2.5 md:px-2"
											(click)="selectItem(item)"
										>
											<ng-icon [name]="item.icon" />
											<span>{{ item.title }}</span>
										</button>
									</li>
								}
							</ul>
						</div>
					</hlm-sidebar-group>
				</hlm-sidebar-content>
				<hlm-sidebar-footer>
					<spartan-nav-user [user]="data.user" />
				</hlm-sidebar-footer>
			</hlm-sidebar>

			<!-- Inner sidebar: mail list -->
			<hlm-sidebar collapsible="none" class="hidden flex-1 md:flex">
				<hlm-sidebar-header class="gap-3.5 border-b p-4">
					<div class="flex w-full items-center justify-between">
						<div class="text-foreground text-base font-medium">{{ _activeItem()?.title }}</div>
						<label hlmLabel class="flex items-center gap-2 text-sm">
							<span>Unreads</span>
							<hlm-switch class="shadow-none" />
						</label>
					</div>
					<input hlmSidebarInput placeholder="Type to search..." />
				</hlm-sidebar-header>
				<hlm-sidebar-content>
					<hlm-sidebar-group class="px-0">
						<div hlmSidebarGroupContent>
							@for (mail of _mails(); track mail.email) {
								<a
									href="#"
									class="border-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
								>
									<div class="flex w-full items-center gap-2">
										<span>{{ mail.name }}</span>
										<span class="text-muted-foreground ml-auto text-xs">{{ mail.date }}</span>
									</div>
									<span class="font-medium">{{ mail.subject }}</span>
									<span class="text-muted-foreground line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
										{{ mail.teaser }}
									</span>
								</a>
							}
						</div>
					</hlm-sidebar-group>
				</hlm-sidebar-content>
			</hlm-sidebar>
		</hlm-sidebar>
	`,
})
export class AppSidebar09 {
	public readonly data = data;
	public readonly navMail = data.navMail;
	protected readonly _activeItem = signal(this.navMail[0]);
	protected readonly _mails = signal(data.mails);

	protected selectItem(item: { title: string; url: string; icon: string; isActive: boolean }): void {
		this._activeItem.set(item);
		const shuffled = [...data.mails].sort(() => Math.random() - 0.5);
		this._mails.set(shuffled.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1)));
	}
}
