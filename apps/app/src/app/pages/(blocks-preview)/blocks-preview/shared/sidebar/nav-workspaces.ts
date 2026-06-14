import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucidePlus } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-workspaces',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports],
	providers: [provideIcons({ lucideChevronRight, lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<div hlmSidebarGroupLabel>Workspaces</div>
			<ul hlmSidebarMenu>
				@for (workspace of workspaces(); track workspace.name) {
					<hlm-collapsible [expanded]="false">
						<li hlmSidebarMenuItem>
							<hlm-collapsible-trigger
								class="data-[state=open]:bg-sidebar-accent [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:data-[state=open]:rotate-90"
							>
								<ng-icon name="lucideChevronRight" class="size-4" />
							</hlm-collapsible-trigger>
							<button
								hlmSidebarMenuButton
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<span>{{ workspace.emoji }}</span>
								<span>{{ workspace.name }}</span>
							</button>
							<button hlmSidebarMenuAction>
								<ng-icon name="lucidePlus" />
								<span class="sr-only">Add page</span>
							</button>
							<hlm-collapsible-content>
								<ul hlmSidebarMenuSub>
									@for (page of workspace.pages; track page) {
										<li hlmSidebarMenuSubItem>
											<a hlmSidebarMenuSubButton>{{ page }}</a>
										</li>
									}
								</ul>
							</hlm-collapsible-content>
						</li>
					</hlm-collapsible>
				}
			</ul>
		</hlm-sidebar-group>
	`,
})
export class NavWorkspaces {
	public readonly workspaces = input.required<{ emoji: string; name: string; pages: string[] }[]>();
}
