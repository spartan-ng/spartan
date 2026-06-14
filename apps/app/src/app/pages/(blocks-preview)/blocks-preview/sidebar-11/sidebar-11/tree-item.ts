import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

type TreeItemType = string | TreeItemType[];

@Component({
	selector: 'spartan-tree-item',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports],
	providers: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (!isArray()) {
			<li hlmSidebarMenuItem>
				<button hlmSidebarMenuButton class="data-[active=true]:bg-transparent">
					<ng-icon name="lucideFile" />
					{{ item() }}
				</button>
			</li>
		} @else {
			<li hlmSidebarMenuItem>
				<hlm-collapsible
					class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
					[expanded]="getName() === 'components' || getName() === 'ui'"
				>
					<button hlmCollapsibleTrigger hlmSidebarMenuButton>
						<ng-icon name="lucideChevronRight" class="transition-transform" />
						<ng-icon name="lucideFolder" />
						{{ getName() }}
					</button>
					<hlm-collapsible-content>
						<ul hlmSidebarMenuSub>
							@for (child of getChildren(); track $index) {
								<spartan-tree-item [item]="child" />
							}
						</ul>
					</hlm-collapsible-content>
				</hlm-collapsible>
			</li>
		}
	`,
})
export class TreeItemComponent {
	public readonly item = input.required<TreeItemType>();

	protected isArray(): boolean {
		return Array.isArray(this.item());
	}

	protected getName(): string {
		const val = this.item();
		return Array.isArray(val) ? (val[0] as string) : val;
	}

	protected getChildren(): TreeItemType[] {
		const val = this.item();
		return Array.isArray(val) ? (val.slice(1) as TreeItemType[]) : [];
	}
}
