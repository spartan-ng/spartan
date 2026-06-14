import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { TreeItemComponent } from './tree-item';

type TreeItem = string | TreeItem[];

@Component({
	selector: 'spartan-sidebar-11',
	imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, TreeItemComponent],
	providers: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-sidebar>
			<hlm-sidebar-content>
				<hlm-sidebar-group>
					<div hlmSidebarGroupLabel>Changes</div>
					<div hlmSidebarGroupContent>
						<ul hlmSidebarMenu>
							@for (change of changes; track change.file) {
								<li hlmSidebarMenuItem>
									<button hlmSidebarMenuButton>
										<ng-icon name="lucideFile" />
										{{ change.file }}
									</button>
									<hlm-sidebar-menu-badge>{{ change.state }}</hlm-sidebar-menu-badge>
								</li>
							}
						</ul>
					</div>
				</hlm-sidebar-group>
				<hlm-sidebar-group>
					<div hlmSidebarGroupLabel>Files</div>
					<div hlmSidebarGroupContent>
						<ul hlmSidebarMenu>
							@for (item of tree; track $index) {
								<spartan-tree-item [item]="item" />
							}
						</ul>
					</div>
				</hlm-sidebar-group>
			</hlm-sidebar-content>
			<hlm-sidebar-rail />
		</hlm-sidebar>
	`,
})
export class AppSidebar11 {
	public readonly changes = [
		{ file: 'README.md', state: 'M' },
		{ file: 'api/hello/route.ts', state: 'U' },
		{ file: 'app/layout.tsx', state: 'M' },
	];
	public readonly tree: TreeItem[] = [
		['app', ['api', ['hello', ['route.ts']], 'page.tsx', 'layout.tsx', ['blog', ['page.tsx']]]],
		['components', ['ui', 'button.tsx', 'card.tsx'], 'header.tsx', 'footer.tsx'],
		['lib', ['util.ts']],
		['public', 'favicon.ico', 'vercel.svg'],
		'.eslintrc.json',
		'.gitignore',
		'next.config.js',
		'tailwind.config.js',
		'package.json',
		'README.md',
	];
}
